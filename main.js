const { app, Tray, Menu, nativeImage, powerMonitor } = require("electron");
const path = require("path");
const cron = require("node-cron");

let tray = null;
let changeIconInterval = null;
let isChangingIcons = false;

app.on("ready", () => {
  if (app.dock) {
    app.dock.hide();
  }

  app.setLoginItemSettings({
    openAtLogin: true,
    openAsHidden: true,
  });

  const icons = [
    nativeImage
      .createFromPath(path.join(__dirname, "white-icon1.png"))
      .resize({ width: 16, height: 16 }),
    nativeImage
      .createFromPath(path.join(__dirname, "white-icon2.png"))
      .resize({ width: 16, height: 16 }),
    nativeImage
      .createFromPath(path.join(__dirname, "white-icon3.png"))
      .resize({ width: 16, height: 16 }),
    nativeImage
      .createFromPath(path.join(__dirname, "white-icon4.png"))
      .resize({ width: 16, height: 16 }),
    nativeImage
      .createFromPath(path.join(__dirname, "white-icon5.png"))
      .resize({ width: 16, height: 16 }),
    nativeImage
      .createFromPath(path.join(__dirname, "white-icon6.png"))
      .resize({ width: 16, height: 16 }),
  ];

  tray = new Tray(icons[0]);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "Water Plant",
      type: "normal",
      click: () => {
        if (isChangingIcons) {
          clearInterval(changeIconInterval);
          isChangingIcons = false;
          updateIcon();
        } else {
          let index = 0;
          changeIconInterval = setInterval(() => {
            tray.setImage(icons[index]);
            index = (index + 1) % icons.length;
          }, 1000); // Change icon every 3 seconds
          isChangingIcons = true;
        }
      },
    },
    {
      label: "Quit",
      type: "normal",
      click: () => {
        app.quit();
      },
    },
  ]);
  tray.setToolTip("Planty - Remember to water your plant");
  tray.setContextMenu(contextMenu);

  const updateIcon = () => {
    const startDate = new Date(2025, 1, 20);
    const today = new Date();
    const diffTime = Math.abs(today - startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    const iconIndex = diffDays % icons.length;
    console.log("sets icon", icons[iconIndex]);
    tray.setImage(icons[iconIndex]);
  };

  updateIcon();

  // Run updateIcon when the Mac wakes up from sleep
  powerMonitor.on("resume", () => {
    updateIcon();
  });
});
