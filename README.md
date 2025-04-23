# AutoPyLoad

A simple Chrome extension to automatically add current url in a PyLoad server queue.

![Screenshot](./media/sample.png)

## Features

- Add current url to PyLoad server queue.
- View history of added urls.
- Clear history of added urls.
- Settings to configure PyLoad server url and api key.

## Build

Use the supplied Makefile to build the extension.

```bash
make build
```
## Install from Chrome Web Store

The extension is release in [Chrome Web Store](https://chromewebstore.google.com/detail/autopyload/ilcjfjpgoaeggpalbjbfiacnedimkodm)

## Install manually from source

1. Clone the repository.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Click on "Load unpacked" and select the cloned repository folder.

## Usage

1. Open Chrome and navigate to `chrome://extensions/`.
2. Click on "AutoPyLoad" extension.
3. Click on the 'cog' icon to open the settings page and configure the PyLoad server url and login credentials.
4. Click on the 'history' icon to open the history page and view the history of added urls.
3. Click on "Add to PyLoad" button to add the current url to the PyLoad server queue.
4. Open PyLoad and see the added url in the queue.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.
