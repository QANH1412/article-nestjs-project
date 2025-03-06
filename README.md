# Deployment Guideline for Heucard-App (React Native)

## 1. Install Dependencies
First, install the required dependencies using Yarn:
```bash
yarn install
```

## 2. Install OpenJDK 17
Download and install OpenJDK 17 manually or use the following command:
```bash
choco install -y nodejs-lts microsoft-openjdk17
```

## 3. Install Android Studio
Download Android Studio from the official website:
[Android Studio Download](https://developer.android.com/studio)

Once installed, open Android Studio, click on **More Actions** and select **SDK Manager**.

## 4. Configure Android SDK

### Select SDK Platform
- Open the **SDK Manager**.
- Select the **SDK Platforms** tab.
- Check the box next to **Show Package Details**.
- Expand **Android 15 (VanillaIceCream)** and make sure the following items are checked:
  - Android SDK Platform 35
  - Intel x86 Atom_64 System Image or Google APIs Intel x86 Atom System Image

### Install SDK Build Tools
- Go to the **SDK Tools** tab.
- Check **Show Package Details**.
- Expand **Android SDK Build-Tools** and select version **35.0.0**.
- Click **Apply** to install the tools.

## 5. Configure Environment Variables
### Set ANDROID_HOME
The React Native tools require environment variables to be set up for native builds.

1. Open the **Windows Control Panel**.
2. Go to **User Accounts > User Accounts**.
3. Click **Change my environment variables**.
4. Click **New...** to create a new `ANDROID_HOME` user variable pointing to your Android SDK path.

### Add Platform-Tools to PATH
1. Open **Windows Control Panel**.
2. Navigate to **User Accounts > User Accounts**.
3. Click **Change my environment variables**.
4. Select the **Path** variable and click **Edit**.
5. Click **New** and add the path to **platform-tools**.

## 6. Set Up an Android Device
### Using a Physical Device
- Connect your Android device via USB.
- Follow the [official setup guide](https://developer.android.com/studio/run/device).

### Using an Android Virtual Device (AVD)
1. Open Android Studio and go to `./AwesomeProject/android`.
2. Open **AVD Manager**.
3. Click **Create Virtual Device...**.
4. Select any Phone and click **Next**.
5. Choose **VanillaIceCream API Level 35**.
6. Click **Next** and then **Finish**.
7. Launch the AVD by clicking the green play button.

## 7. Run the React Native App
Navigate to the project directory and start the app:
```bash
cd <your-project-directory>
yarn android
```

