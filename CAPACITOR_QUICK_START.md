# Capacitor Quick Start Guide

## Quick Commands

```bash
# Build and sync iOS (all-in-one)
npm run cap:build:ios

# Or step by step:
npm run build          # Build React app
npm run cap:sync       # Sync to iOS
npm run cap:open:ios   # Open in Xcode
```

## First Time Setup (on macOS)

1. **Install CocoaPods**:
   ```bash
   sudo gem install cocoapods
   ```

2. **Install iOS Dependencies**:
   ```bash
   cd ios/App
   pod install
   cd ../..
   ```

3. **Open in Xcode**:
   ```bash
   npm run cap:open:ios
   ```

4. **Configure Signing**:
   - In Xcode, select the "App" target
   - Go to "Signing & Capabilities"
   - Select your Apple Developer Team
   - Xcode will handle provisioning automatically

5. **Build and Run**:
   - Select a simulator or connected device
   - Click Run (▶️) or press `Cmd + R`

## App Store Submission Checklist

- [ ] Apple Developer Account ($99/year)
- [ ] App created in App Store Connect
- [ ] Bundle ID matches: `com.tijaniyahmuslimpro.app`
- [ ] App icons configured (1024x1024px)
- [ ] Splash screen configured
- [ ] Privacy Policy URL added
- [ ] App description and screenshots ready
- [ ] App archived and uploaded
- [ ] Submitted for review

## Important Notes

- **Always open `.xcworkspace`, not `.xcodeproj`**
- **Run `npm run cap:sync` after every build**
- **Test on real devices before App Store submission**
- **iOS development requires macOS and Xcode**

For detailed instructions, see `CAPACITOR_SETUP.md`.

