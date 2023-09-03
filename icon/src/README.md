# webterm icon

## Prequisites

- macOS
- Liam Rosenfeld's [Iconology](https://apps.apple.com/us/app/iconology/id1463452867?mt=12)

## Recreating the icon

[shell-prompt.png](./shell-prompt.png) was captured from a very strongly font-and-margin-sized-up terminal with PS1 set to `"$  "`. [Preview](https://support.apple.com/guide/preview/welcome/mac) was then used to remove the black background with Markup → Instant Alpha. The result was cropped tightly.

The result was loaded into Iconology. Export As was set to "MacOS Icon", Background to pure black ("Black" from the Apple color palette), and Image Scale to 30%. "AppIcon.appiconset" was exported.

[appiconset-to-iconset](./appiconset-to-iconset) was used to convert the result to .icns format:

```
./appiconset-to-iconset AppIcon
```

The result was renamed "webterm.icns" and moved up to the [icon](../) folder to be picked up by the build process.
