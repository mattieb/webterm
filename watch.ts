import { $ } from "zx";
import { watch } from "turbowatch";
import {
  getWorkspaceRoot,
  getPackageInfos,
  createPackageGraph,
} from "workspace-tools";
import path from "node:path";
import type { IterableElement } from "type-fest";
import type { TurbowatchConfigurationInput } from "turbowatch/dist/types";

type TriggerInput = IterableElement<TurbowatchConfigurationInput["triggers"]>;

const isUndefined = (value: any): value is undefined =>
  typeof value === "undefined";
const defined = <T>(value: T | undefined) => {
  if (isUndefined(value)) throw new Error("undefined");
  return value;
};
const partial =
  <TArg1, TRest extends any[], TReturn>(
    fn: (arg1: TArg1, ...rest: TRest) => TReturn,
    arg1: TArg1
  ): ((...rest: TRest) => TReturn) =>
  (...rest) =>
    fn(arg1, ...rest);

const getLeaves = (
  dependents: { [key: string]: string[] },
  node: string
): string[] => {
  if (isUndefined(dependents[node])) return [node];
  return dependents[node]
    .map(partial(getLeaves, dependents))
    .reduce((a, d) => a.concat(d), [])
    .reduce((a, d) => (a.includes(d) ? a : a.concat([d])), [] as string[]);
};
const makeFilterFlags = (
  relativePaths: { [key: string]: string },
  leaves: string[]
) => leaves.map((l) => `--filter=./${relativePaths[l]}`);

const main = async () => {
  const project = defined(getWorkspaceRoot(path.dirname(__filename)));
  const packageInfos = getPackageInfos(project);
  const packageGraph = createPackageGraph(packageInfos);
  const dependents = packageGraph.dependencies.reduce(
    (a, d) => ({
      ...a,
      [d.dependency]: (isUndefined(a[d.dependency])
        ? []
        : a[d.dependency]
      ).concat([d.name]),
    }),
    {}
  );

  const boundGetLeaves = partial(getLeaves, dependents);
  const leaves = Object.fromEntries(
    packageGraph.packages.map((p) => [p, boundGetLeaves(p)])
  );
  const allLeaves = Object.values(leaves)
    .reduce((a, d) => a.concat(d), [])
    .reduce((a, d) => (a.includes(d) ? a : a.concat([d])), [] as string[]);
  const relativePaths = Object.fromEntries(
    packageGraph.packages.map((p) => [
      p,
      path.relative(project, path.dirname(packageInfos[p].packageJsonPath)),
    ])
  );
  const boundMakeFilterFlags = partial(makeFilterFlags, relativePaths);

  const buildTriggers: TriggerInput[] = packageGraph.packages.map((name) => ({
    expression: [
      "allof",
      ["not", ["anyof", ["dirname", "node_modules"], ["dirname", "lib"]]],
      ["dirname", path.join(relativePaths[name], "src")],
      [
        "anyof",
        ["match", "*.ts", "basename"],
        ["match", "*.css", "basename"],
        ["match", "*.html", "basename"],
      ],
    ],
    name: `${name}:build`,
    initialRun: false,
    onChange: async ({ spawn, files }) => {
      console.log(
        `${relativePaths[name]}: changes detected: ${files.map((f) => f.name)}`
      );
      const filterFlags = boundMakeFilterFlags(leaves[name]);
      await spawn`npx turbo build --output-logs=new-only ${filterFlags}`;
    },
  }));

  const filterFlags = boundMakeFilterFlags(allLeaves);
  await $`npx turbo build --output-logs=new-only ${filterFlags}`;

  const triggers = buildTriggers;

  watch({ project, triggers });
};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
