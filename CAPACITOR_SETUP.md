# Capacitor iOS Setup Guide

This guide explains how to build and deploy the Tijaniyah Muslim Pro web app as a native iOS app using Capacitor.

## Prerequisites

1. **macOS** - iOS development requires a Mac with macOS
2. **Xcode** - Install Xcode from the Mac App Store (latest version recommended)
3. **Xcode Command Line Tools** - Install via: `xcode-select --install`
4. **CocoaPods** - Install via: `sudo gem install cocoapods`
5. **Apple Developer Account** - Required for App Store submission ($99/year)

## Initial Setup

Capacitor has been initialized and configured. The iOS platform has been added.

## Development Workflow

### 1. Build the Web App

First, build your React app:

```bash
npm run build
```

### 2. Sync with iOS

After building, sync the web assets to the iOS project:

```bash
npm run cap:sync
```

Or use the combined command:

```bash
npm run cap:build:ios
```

This will:
- Build the React app
- Copy web assets to the iOS project
- Update native dependencies

### 3. Open in Xcode

Open the iOS project in Xcode:

```bash
npm run cap:open:ios
```

Or manually:
```bash
open ios/App/App.xcworkspace
```

**Important**: Always open the `.xcworkspace` file, not the `.xcodeproj` file!

## Building for iOS

### Development Build (Simulator)

1. Open the project in Xcode
2. Select a simulator from the device dropdown
3. Click the Run button (▶️) or press `Cmd + R`
4. The app will build and launch in the simulator

### Production Build (Device/App Store)

1. **Configure Signing**:
   - Open the project in Xcode
   - Select the "App" target
   - Go to "Signing & Capabilities"
   - Select your Team (Apple Developer account)
   - Xcode will automatically manage provisioning profiles

2. **Set Bundle Identifier**:
   - The bundle ID is set to: `com.tijaniyahmuslimpro.app`
   - You can change it in Xcode if needed (must match your App Store Connect app)

3. **Configure App Icons and Splash Screen**:
   - App icons should be placed in `ios/App/App/Assets.xcassets/AppIcon.appiconset/`
   - Splash screen images in `ios/App/App/Assets.xcassets/Splash.imageset/`
   - Use the `appicon.png` from your assets folder

4. **Build for Device**:
   - Connect your iOS device via USB
   - Select your device from the device dropdown
   - Click Run (▶️)
   - Trust the developer certificate on your device if prompted

5. **Archive for App Store**:
   - In Xcode, go to Product → Archive
   - Wait for the archive to complete
   - The Organizer window will open
   - Click "Distribute App"
   - Follow the wizard to upload to App Store Connect

## App Store Submission

### 1. Create App in App Store Connect

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click "My Apps" → "+" → "New App"
3. Fill in:
   - Platform: iOS
   - Name: Tijaniyah Muslim Pro
   - Primary Language: English
   - Bundle ID: com.tijaniyahmuslimpro.app
   - SKU: tijaniyah-muslim-pro-ios
   - User Access: Full Access

### 2. Prepare App Information

- **App Description**: Write a compelling description
- **Keywords**: Add relevant keywords for search
- **Screenshots**: Required for different device sizes
- **App Icon**: 1024x1024px PNG
- **Privacy Policy URL**: Required
- **Support URL**: Required

### 3. Upload Build

1. Archive your app in Xcode (Product → Archive)
2. In Organizer, click "Distribute App"
3. Select "App Store Connect"
4. Follow the wizard to upload
5. Wait for processing (can take 10-30 minutes)

### 4. Submit for Review

1. In App Store Connect, go to your app
2. Click "+" next to "iOS App" to create a new version
3. Select the uploaded build
4. Fill in all required information
5. Submit for review

## Configuration Files

### capacitor.config.ts

The main Capacitor configuration file. Key settings:
- `appId`: Bundle identifier
- `appName`: Display name
- `webDir`: Directory containing built web assets
- `ios`: iOS-specific settings

### iOS Project Structure

```
ios/
├── App/
│   ├── App/
│   │   ├── AppDelegate.swift
│   │   ├── Info.plist
│   │   └── Assets.xcassets/
│   ├── App.xcodeproj/
│   └── App.xcworkspace/
└── Podfile
```

## Updating the App

When you make changes to your React app:

1. Build: `npm run build`
2. Sync: `npm run cap:sync`
3. Open in Xcode: `npm run cap:open:ios`
4. Test and build as needed

## Troubleshooting

### CocoaPods Issues

If you encounter CocoaPods errors:

```bash
cd ios/App
pod deintegrate
pod install
cd ../..
```

### Build Errors

1. Clean build folder: Product → Clean Build Folder (Shift + Cmd + K)
2. Delete Derived Data: Xcode → Preferences → Locations → Derived Data → Delete
3. Reinstall pods: `cd ios/App && pod install`

### Sync Issues

If assets aren't updating:

```bash
npm run build
npx cap sync ios --force
```

## Native Features

Capacitor plugins are available for:
- **StatusBar**: Control status bar appearance
- **SplashScreen**: Manage splash screen
- **Haptics**: Vibration and haptic feedback
- **Keyboard**: Keyboard management
- **App**: App lifecycle events

To use these in your React code:

```typescript
import { StatusBar } from '@capacitor/status-bar';
import { Haptics } from '@capacitor/haptics';

// Example usage
StatusBar.setStyle({ style: Style.Light });
Haptics.impact({ style: ImpactStyle.Medium });
```

## Additional Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [iOS Development Guide](https://capacitorjs.com/docs/ios)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)

## Notes

- The iOS project is generated and should be committed to Git
- Build artifacts (Pods, build folders) are in .gitignore
- Always use `npm run cap:sync` after building to update native projects
- Test thoroughly on real devices before submitting to App Store

