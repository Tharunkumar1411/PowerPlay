# PowerPlay — GitHub Repo Explorer (React Native)

Browse and bookmark GitHub repositories from your phone.
Search repos, infinite-scroll 30 at a time, and save favorites locally for quick access.

## ✨ Features

* **Search GitHub repositories** (GitHub REST v3)
* **Infinite scroll** (30 repos per page)
* **Bookmark** any repo with a star toggle
* **Persist bookmarks** with `AsyncStorage`
* Clean UI with `FlatList` + memoized cards

---

## 🛠️ Tech Stack

* **React Native** `0.74.7`
* **React Navigation (native-stack)** `^7.x`
* **Axios** for HTTP
* **AsyncStorage** for persistence
* **react-native-vector-icons** for the bookmark icon
* **react-native-config** for environment variables
* (Dev) **Reactotron** for debugging

### Prerequisites

* Node 18+
* Android Studio (or Xcode for iOS)
* A device/emulator
* (Optional) A GitHub token if you hit rate limits

### 1) Install

```bash
npm install
# iOS only:
npx pod-install ios
```

### 2) Environment

Create **`.env`** at the project root:

```env
HOST=https://api.github.com
```

### 2) Run

```bash
# Start Metro
npm run start

# Run Android (uses .env via script)
npm run debugAssembleAndroid
# or iOS:
npx react-native run-ios
```

---

## 🔌 API

### Endpoint

Search repositories:

```
GET /search/repositories?q=<query>&per_page=30&page=<n>
Base URL: https://api.github.com
```

## 📲 UX Details

### Search

* Debounced input (500ms) calls `getSearchRepo(query)`.

### Bookmarking

* Tap the **star** on a card to toggle.
* Stored under `AsyncStorage` key `bookmarkedRepos` as an array of repo objects.
* “Book marked repos” switch shows only saved repos; un-starring inside this view updates the list immediately.

---

## 🧩 Key Components

### `RepoCard.tsx`

* Shows avatar, `full_name`, description, language, stars, forks, last updated.
* Bookmark button (MaterialCommunityIcons: `star` / `star-outline`).
* Opens repository in the browser on press.

### `Home.tsx`

* Header, search input, bookmark toggle.
* `FlatList` of `RepoCard` with stable `keyExtractor = (item) => String(item.id)`.

### `axios.ts`

* `APIClient()` with `baseURL = HOST` from `.env`.
* Adds GitHub headers.
* Central place to inject a token if needed.

---

## 🧪 Scripts (package.json)

```json
"start": "react-native start",
"debugAssembleAndroid": "ENVFILE=.env npx react-native run-android",
"assembleDevAndroid": "cd android && ./gradlew clean && ENVFILE=.env ./gradlew assembleRelease",
"assembleProdAndroid": "cd android && ./gradlew clean && ENVFILE=.env.production ./gradlew assembleRelease",
"bundleProdAndroid": "cd android && ./gradlew clean && ENVFILE=.env.production ./gradlew bundleRelease",
"lint": "eslint . --ext .js,.jsx,.ts,.tsx",
"lint:fix": "eslint . --ext .js,.jsx,.ts,.tsx --fix"
```