# Pyit Taing Taung – Offline Chatbot (Expo + Expo Router)

An offline-first chatbot app designed for regions with limited connectivity. Built with Expo, React Native, and Expo Router. The app ships with a friendly onboarding, a home dashboard, a chat screen with a mock offline LLM, and a modern bottom navigation (Home · New chat · Settings).

![Logo](./assets/images/pyit-logo.png)

## Features

- Offline-friendly mock LLM with simple intent responses (replaceable with ExecuTorch/on-device models)
- Welcome/onboarding screen with EN/MM language selection and start CTA
- Home screen with quick actions and recent chats list/empty state
- Chat screen with bubble UI, typing indicator, and history persistence
- Settings screen for language and theme (light/dark/system), clear history, and about
- Custom bottom tab bar style that matches the provided design

## Project structure

```
app/
  _layout.tsx            # Root stack with onboarding gating
  welcome.tsx            # Onboarding screen (logo, language, start)
  (tabs)/                # Tab navigator (Home, Chat, Settings)
    _layout.tsx
    index.tsx            # Home
    chat.tsx             # Chat
    settings.tsx         # Settings
contexts/
  PreferencesContext.tsx # Language/theme/onboarding persistence
i18n/
  strings.ts             # EN/MM strings
styles/
  theme.ts               # Centralized color palette
assets/images/pyit-logo.png  # App and welcome logo
```

## Requirements

- Node 18+
- Expo CLI (installed via `npx`)

## Setup

1) Install dependencies

```bash
npm install
```

2) Start the app

```bash
npx expo start
```

Then press `a` (Android), `i` (iOS), or `w` (Web). If icons/splash don’t refresh, clean the cache or reinstall the dev build/Expo Go.

## Environment and persistence

- AsyncStorage is used to persist chat messages and preferences.
- On first launch, the onboarding screen appears. After tapping Start, the app navigates to the tab bar.

## Replacing the mock LLM

The chat currently uses a mock hook for offline responses. To integrate an on-device model:

- Create a hook in `hooks/useOfflineLLM.ts` that loads your model/tokenizer (e.g., ExecuTorch).
- Replace the mock in `app/(tabs)/chat.tsx` with your real generate function.
- Keep responses short and stream if possible for better UX.

## Theming and localization

- Update colors in `styles/theme.ts`.
- Add or refine strings in `i18n/strings.ts` (English/Myanmar supported).

## Icons and splash

- App icon, adaptive icon, and favicon paths are configured in `app.json` and currently point to `assets/images/pyit-logo.png`.
- Splash image is configured via the Expo splash plugin. Replace files in `assets/images/` as needed.

## Troubleshooting

- Settings tab not opening: ensure the tab route is named `settings` and the screen file is `app/(tabs)/settings.tsx`.
- Icons not updating: clear cache (`expo start -c`) or reinstall on the simulator/device.
- Android bundling errors: ensure `react-native-reanimated` is installed and the babel plugin is set by Expo (default in SDK 53).

## License

Private, for project use.