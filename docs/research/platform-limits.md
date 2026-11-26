---
type: research
title: "Platform limits for local files and offline use"
ticket: 41
date: 2026-11-26
---

# Platform limits for local files and offline use

Research note for issue #41. It records what a desktop app and a web app can each do with local markdown files and offline data. It states facts only. It does not choose a technology, a framework or an architecture.

## How to read this note

- **Checked on:** every source below was opened on 26 November 2026.
- **Scope:** desktop browsers only (Chrome, Edge, Safari, Firefox on Windows, macOS and Linux). Mobile browsers were not checked.
- **"Chromium browsers"** means Chrome and Edge. Other browsers built on Chromium can differ: Chrome's own documentation says Brave keeps local file access behind a flag ([chrome-fsa]).
- **"Inferred"** marks a statement that no opened source says outright. It follows from the sources cited next to it.
- **Browser support data** comes from MDN's browser-compat-data repository, read at its `main` branch (last commit 25 November 2026).
- Sources are listed in full at the end.

## Short answer

- Only Chromium browsers let a web app open a folder on the user's disk, save into it and watch it. Safari and Firefox do not, and both vendors have a recorded position against it.
- Even in Chromium the access is conditional. The user picks the folder, some folders are refused, and access lapses unless the user chooses to keep it or installs the app.
- Every browser gives a web app plenty of private offline storage. None of them promises to keep it. Safari is the strictest: a site that is not added to the Dock can lose its data after seven days of Safari use without a visit.
- No browser lets a web app run freely while it is closed. A desktop app can do all of these things, subject to the user's operating system settings.

## 1. A local folder from a browser

### Which browsers

| Capability | Chrome and Edge | Safari | Firefox | Source |
|---|---|---|---|---|
| Folder picker (`showDirectoryPicker`) | Yes, since version 86 | No | No | [bcd-window] |
| File open and save pickers | Yes, since version 86 | No | No | [bcd-window] |
| Ask for or check permission on a saved handle | Yes, since version 86 | No | No | [bcd-handle] |
| Watch for changes (`FileSystemObserver`) | Yes, since version 133, desktop only | No | No | [bcd-observer], [chromestatus-observer] |
| Browser-private file storage (OPFS) | Yes, since 86 | Yes, since 15.2 | Yes, since 111 | [bcd-storage] |
| Write stream on a file handle | Yes, since 86 | Yes, since 26 | Yes, since 111 | [bcd-filehandle] |
| One-off folder import through a file input | Yes | Yes | Yes | [bcd-input] |

Notes on the table:

- MDN marks the pickers as experimental and of limited availability ([mdn-picker]). The specification behind them is a community group draft dated 10 October 2025. It is not on a standards track ([wicg-fsa]).
- WebKit's recorded position on local file access is "oppose", set in February 2023, with security given as the concern. The position excludes browser-private storage, which WebKit supports. The issue was still receiving requests in October 2026 and the position has not changed ([webkit-position]).
- Mozilla's recorded position is "negative", labelled in September 2024. The stated concerns are about access to real files and folders, not about browser-private storage ([moz-position]).
- Apple's 2026 developer session on new WebKit features says nothing about file access, storage or web apps ([apple-wwdc26]).
- Safari added the write stream in version 26 ([webkit-s26]). In Safari and Firefox it works only on browser-private files, because those browsers have no way to hand a web app a handle to a user's file (inferred from [bcd-window], [bcd-dnd] and [bcd-filehandle]).
- In Chromium a handle can also come from a drag and drop or from the operating system's "Open with" menu ([mdn-fsapi]).

### How it works in Chromium browsers

**Opening.**

- The page must be served over HTTPS and the picker must follow a user action such as a click ([mdn-picker], [wicg-fsa]).
- The user chooses the folder in the system's own picker. The web app gets read access by default. Edit access is a separate request and a separate prompt ([chrome-fsa]).
- If the user refuses edit access, the app cannot save to the folder ([chrome-fsa]).

**Folders that are refused.** Chromium's source code holds the list ([chromium-blocklist], file last changed 20 November 2026):

- The user's whole home folder, whole Desktop, whole Documents folder and whole Downloads folder cannot be chosen. A folder inside any of them can.
- System folders, application folders and application data folders are blocked with everything in them. Examples: the Windows and Program Files folders, `AppData`, the macOS `Library` folder (cloud storage folders inside it are allowed), and hidden settings folders such as `.ssh` and `.config`.
- Writing into a `.git` folder is blocked, apart from some repository data paths.
- If the user picks a blocked folder, the picker is shown again or the request fails ([wicg-fsa], [mdn-picker]).

**Permission prompts and restarts.**

- By default, access lasts until every tab of the site is closed. On the next visit the user is asked again ([chrome-fsa]).
- A web app can keep the folder handle in browser storage and ask to use it again on a later visit ([chrome-fsa]).
- Since Chrome 122, that later request shows three choices: allow this time, allow on every visit, or do not allow. "Allow on every visit" keeps access until the user removes it ([chrome-persist]).
- An installed web app keeps access automatically once the user has granted it. It does not show the three-way prompt ([chrome-persist]).
- Chrome removes access on its own when a tab has been in the background for a while. The app must then ask again ([chrome-persist]).
- The user can remove access at any time from the address bar or site settings. Clearing browsing data removes the grants and the saved handles ([chrome-persist], [wicg-fsa]).
- The saved handle lives in browser storage, so it is lost if that storage is evicted (section 2). The files stay on disk. The user would need to pick the folder again (inferred from [wicg-fsa] and [mdn-quota]).
- Edge follows Chromium for these APIs according to the support data ([bcd-window], [bcd-handle]). That Edge shows the same three-way prompt is inferred; no Microsoft source was found for it.

**Saving.**

- Changes reach the file only when the write is closed. The usual implementation writes a temporary file and then replaces the original ([mdn-writable], [chrome-fsa]).
- The browser may run malware and safe-browsing checks on a written file, and a failed check aborts the write ([mdn-writable], [wicg-fsa]).
- Files in a user's folder do not count against the browser storage quota ([wicg-fsa]).

**Noticing changes made by another program.**

- `FileSystemObserver` reports that a file or folder appeared, disappeared, was modified or was moved. It can cover a whole folder tree ([chrome-observer]).
- Chrome's feature entry describes it as reporting changes to files on the user's device to which the user has granted access ([chromestatus-observer]). That this includes changes made by other programs is inferred from that description.
- It shipped in Chrome 133 on desktop. MDN marks it experimental and non-standard, and its specification text is still a pending proposal ([mdn-observer], [chromestatus-observer]).
- Limits ([chrome-observer]):
  - The detail of each report depends on the operating system. On Windows a move between folders is reported as a disappearance plus an appearance.
  - Reports can be missed. The app is then told "unknown" and must re-read the folder.
  - There is a limit on how much one site can watch. The limit depends on the operating system and is not known in advance.
  - Watching stops with an error if permission is removed or the watched folder is deleted or moved.
- It works only while the app is open (inferred: the observer belongs to a running page and section 4 shows nothing runs in its place).
- Before this feature, a web app had to re-read file dates or contents on a timer to spot changes ([chrome-observer]).
- Mozilla's position on the observer is positive about the use case. WebKit has given no signal. Neither has shipped it ([moz-observer], [chromestatus-observer], [bcd-observer]).

### What Safari and Firefox users can do instead

- **Import a folder once.** A file input can read a chosen folder, and files and folders can be dragged in ([bcd-input], [bcd-dnd], [chrome-fsa]). This is a read-only copy at that moment, and the app keeps no link to the folder (inferred: neither route returns a handle the app can write to or reopen, [bcd-dnd]).
- **Export by download.** Without edit access, the fallback Chrome's documentation names is a download. Each save produces a download and does not update the original file in place (first part [chrome-fsa]; second part inferred).
- **Keep documents in browser-private storage.** OPFS is available in all three browsers. It is not visible to the user as ordinary files, needs no prompt, counts against the storage quota and is deleted when site data is cleared ([mdn-opfs]).

## 2. Browser-private storage

### How much a web app can keep

| Browser | Limit for one site | Source |
|---|---|---|
| Chrome and Edge | Up to 60% of total disk size. All sites together: up to 80%. | [mdn-quota] |
| Firefox | Default: the smaller of 10% of total disk size or 10 GiB, shared by all origins of the same site. With persistent storage: up to 50% of total disk size, capped at 8 TiB. | [mdn-quota] |
| Safari (macOS 14 and later) | About 60% of total disk size, in Safari and in web apps added to the Dock. All sites together: about 80%. | [mdn-quota], [webkit-storage] |

- Limits are worked out from total disk size, not free space, so a site may hit a full disk before its limit ([mdn-quota]).
- The limit covers IndexedDB, the Cache API and OPFS together. The older `localStorage` is capped at about 5 MiB ([mdn-quota]).
- Going over the limit makes the write fail with an error. The browser does not ask the user for more space ([mdn-quota], [webdev-storage], [webkit-storage]).
- Private or incognito windows may get smaller limits, and their data is normally deleted when the session ends ([mdn-quota]). Chrome's incognito limit is about 5% of disk ([webdev-storage]).
- With Chrome's "clear cookies and site data when you close all windows" setting on, the limit drops to about 300 MB ([webdev-storage]).

A folder of markdown documents is small next to these limits. Capacity is not the constraint. Retention is.

### When a browser may delete the data

- By default, every site's storage is "best effort" in all three browsers ([mdn-quota]).
- When the device is short of space, or all sites together pass the browser's total limit, the browser deletes data from the least recently used site first ([mdn-quota]).
- Deletion is all or nothing for a site: its databases, caches and private files go together ([mdn-quota]).
- WebKit does not evict a site that has a page open at that moment ([webkit-storage]).
- MDN cites Chrome team research saying eviction is rare for sites a user visits regularly ([mdn-quota]).
- The user can clear a site's data at any time in every browser ([webdev-persist]).

**Safari's extra rule for sites not added to the Dock or Home Screen.**

- When cross-site tracking prevention is on, Safari deletes script-written storage for a site the user has not interacted with during the last seven days of browser use ([mdn-quota], [webkit-itp]).
- The seven days count days on which Safari is used, not calendar days ([webkit-itp-2020]).
- The deleted data includes IndexedDB, `localStorage`, and service worker registrations and caches ([webkit-itp]). Losing the service worker registration also removes offline start-up.
- WebKit's list does not name OPFS. Whether OPFS is covered was not confirmed. MDN describes the rule as covering script-created data in general ([mdn-quota]).
- A web app added to the Home Screen is exempt: WebKit skips its domain when removing data, and its data is kept apart from Safari ([webkit-itp]). WebKit says such apps keep their own count of days of use and that it does not intend to delete their first-party data ([webkit-itp-2020]).
- Those two WebKit pages speak of Home Screen web apps. That the exemption also covers web apps added to the Dock on a Mac is inferred. WebKit's storage policy treats the two alike for quota ([webkit-storage]).

### What "persistent storage" changes

- A site can ask for its storage to be marked persistent. Persistent storage is skipped by the low-space clean-up. It is then deleted only if the user chooses to delete it ([mdn-quota], [webdev-persist]).
- **Chrome and Edge:** no prompt. The browser decides silently, using signals such as how much the user engages with the site, whether it is installed or bookmarked, and whether it may send notifications. The request can be refused ([webdev-persist], [mdn-quota]).
- **Safari:** no prompt. WebKit decides by its own rules; the one example it gives is whether the site is opened as a Home Screen web app ([webkit-storage], [mdn-quota]).
- **Firefox:** the user sees a prompt and decides ([mdn-quota], [webdev-persist]).
- Persistent storage does not raise the limit in Chromium. In Firefox it raises it, as shown in the table above. MDN gives no separate figure for Safari ([mdn-quota]).
- No source opened says whether persistent storage also protects a Safari tab from the seven-day rule.

## 3. Installable web apps

### Which browsers can install

- **Chrome and Edge:** install on every desktop system they support. The site needs HTTPS and a web app manifest. A service worker is not required for installing ([mdn-installable]).
- **Safari:** "Add to Dock" on macOS 14 and later, for any site, with or without a manifest ([mdn-installable], [apple-webapps], [webkit-s17]).
- **Firefox:** does not install web apps from a manifest ([mdn-installable]). Firefox has its own "web apps" feature that pins a site in a simplified window. It is on by default on Windows, off by default on Linux and not available on macOS ([fx-webapps]).

### What installing changes

| Area | Chrome and Edge | Safari (Add to Dock) | Firefox |
|---|---|---|---|
| Offline start-up | Gives an icon that opens the app even when offline. Offline loading itself still comes from the service worker, installed or not ([mdn-install], [mdn-offline]). The app can be set to launch when the user signs in ([chrome-help-apps]). | Same icon and window. Service workers are supported in Dock web apps ([webkit-s17]). | A pinned window only. It shares the browser's profile and process ([fx-webapps]). |
| Storage | No change of limit is documented (inferred from [mdn-quota]). Installing is one of the signals for granting persistent storage ([webdev-persist]). | Same limit as in Safari ([webkit-storage]). The web app gets its own storage, separate from Safari. Only cookies are copied when it is created, so data saved earlier in a Safari tab does not come across ([webkit-s17], [apple-webapps]). Exempt from the seven-day rule (section 2). Being opened as an installed web app is WebKit's example of a signal for granting persistent storage ([webkit-storage]). | No change: same profile as the browser (inferred from [fx-webapps]). |
| File access | Folder access is kept automatically once granted ([chrome-persist]). The app can register to open file types from the operating system's "Open with" menu, on desktop only, with a prompt on first use ([chrome-filehandling], [bcd-launch]). | No change. There is still no folder or file access ([bcd-window], [bcd-launch]). | No change ([bcd-window], [bcd-launch]). |

Other facts:

- An installed web app belongs to the browser that installed it. The same app installed from two browsers is two apps that share no data ([mdn-install]).
- Removing a Chrome web app deletes its data only if the user ticks that option ([chrome-help-apps]).
- A web app cannot start offline the first time. Its files must be fetched and cached during a first online visit; only pages opened after that are served from the cache ([mdn-sw]). This holds whether or not the app is later installed (inferred from [mdn-sw] and [mdn-installable]).

## 4. Background behaviour

A web app's page code does not run when its tab or window is closed. Only its service worker can run, and only when the browser wakes it for an event. Chrome stops a service worker after about 30 seconds idle and caps a single task at about five minutes ([mdn-offline]).

| Mechanism | What it does | Chrome and Edge | Safari | Firefox | Source |
|---|---|---|---|---|---|
| Background Sync | Finishes a send that failed offline, once the network is back. Must be requested while the app is open. Retries and duration are limited. | Yes | No | No | [bcd-sync], [mdn-offline], [mdn-bgsync] |
| Periodic Background Sync | Lets the app refresh data now and then. | Yes, with conditions | No | No | [bcd-periodic], [chrome-periodic] |
| Background Fetch | Hands a large download to the browser, with visible progress the user can cancel. | Yes | No | No | [bcd-bgfetch], [mdn-offline] |
| Push | A server wakes the service worker with a message. | Yes | Yes, macOS 13 and later | Yes | [bcd-push], [mdn-offline] |

- **Periodic Background Sync conditions in Chromium:** the app must be installed, the user must have engaged with it, and the device must be on a network it has used before. The browser decides how often it runs, in step with how often the user opens the app. An app that is rarely used may get none ([chrome-periodic], [edge-bg], [mdn-offline]).
- **Push conditions:** the user must grant permission, and browsers require each push to show a visible notification. No browser supports silent push ([mdn-offline]).
- Taken together: no desktop browser offers a way to keep a continuous connection, or to sync quietly, while the app is closed. Chromium can finish a pending send and can refresh occasionally for an installed app. Safari and Firefox can only receive a push that shows a notification.
- Not confirmed: whether Chromium delivers these events on a desktop computer when the browser itself is not running.

## 5. A desktop app, for contrast

In product terms only.

- **Folder access.** A desktop app can read and write any folder the user's account can reach, with no browser in between.
  - macOS lets the user switch access to the Desktop, Documents and Downloads folders on or off for each app ([apple-files]).
  - A sandboxed Mac app is limited to the folders the user picks. Picking a folder grants everything inside it, and the app can keep that access across restarts ([apple-sandbox]).
  - Access to every file on a Mac needs the user to grant Full Disk Access in settings ([apple-sandbox]).
- **File watching.** All three desktop systems give apps notice of changes in a folder: macOS ([apple-fsevents]), Windows ([ms-watch]) and Linux ([linux-inotify]). That this covers changes made by any program is inferred: the notices describe the folder, not who changed it.
  - Reports can be dropped when many changes arrive at once. The app must then re-read the folder ([ms-watch], [linux-inotify]).
  - On Linux, watching is per folder, there is a per-user limit on watches, and changes made on network drives are not reported ([linux-inotify]).
- **Running while the window is closed.** A desktop app can start when the user signs in and can keep working with no window open. The user controls this: macOS has "Open at Login" and "App Background Activity" settings ([apple-login]), and Windows has startup app settings ([ms-startup]).
- **Storage.** Files in an ordinary folder are outside browser quotas and browser eviction (inferred: the rules in section 2 apply to browser storage only, [mdn-quota]).
- **First launch.** The app's code is on disk once installed, so the first launch needs no network (inferred, by contrast with [mdn-sw]).

## 6. Product promises that are safe

"Yes" means the platform supports the promise without conditions the user would notice. "Partly" means it works under the conditions stated. "No" means the platform does not allow it.

| Promise | Desktop app | Web app in Chromium browsers | Web app in Safari | Web app in Firefox |
|---|---|---|---|---|
| Open a local folder | **Yes.** Any folder the user can reach. On a Mac the user can switch off an app's access to Desktop, Documents and Downloads; a sandboxed Mac app is limited to folders the user picks. [apple-files], [apple-sandbox] | **Partly.** The user picks the folder after a click. Whole home, Desktop, Documents and Downloads folders and system folders are refused. [bcd-window], [chromium-blocklist] | **No.** No folder picker; WebKit opposes it. A one-off read-only import is possible. [bcd-window], [webkit-position], [bcd-input] | **No.** No folder picker; Mozilla's position is negative. A one-off read-only import is possible. [bcd-window], [moz-position], [bcd-input] |
| Keep folder access after a restart | **Yes.** Access stays; a sandboxed Mac app can store it. [apple-sandbox] | **Partly.** Only if the user chooses "allow on every visit" or installs the app. Otherwise the user is asked on each visit. [chrome-persist], [chrome-fsa] | **No.** There is no folder access to keep. [bcd-handle] | **No.** There is no folder access to keep. [bcd-handle] |
| Save edits straight to .md files | **Yes.** Ordinary file writes (inferred for apps outside a sandbox). A sandboxed Mac app can write to folders the user picked. [apple-sandbox] | **Partly.** Needs a separate edit permission. The file is replaced when the write closes. The browser may run safety checks. [chrome-fsa], [mdn-writable] | **No.** Writing works only in browser-private storage. A user's file can only be replaced by a download (inferred). [bcd-filehandle], [bcd-window] | **No.** Writing works only in browser-private storage. A user's file can only be replaced by a download (inferred). [bcd-filehandle], [bcd-window] |
| Notice outside edits | **Yes.** The system reports changes in a folder (by any program: inferred). Reports can be dropped under load, so an occasional re-read is needed. [apple-fsevents], [ms-watch], [linux-inotify] | **Partly.** Since version 133, on desktop, while the app is open and holds permission. Experimental and non-standard. Reports can be missed. [bcd-observer], [chrome-observer], [mdn-observer] | **No.** No folder access and no change observer. [bcd-observer] | **No.** No folder access and no change observer. [bcd-observer], [moz-observer] |
| Keep all documents offline | **Yes.** Ordinary files, outside browser limits (inferred). [mdn-quota] | **Yes.** Up to 60% of disk size for one site, in browser-private storage. [mdn-quota] | **Yes.** About 60% of disk size for one site on macOS 14 and later. [webkit-storage], [mdn-quota] | **Yes.** Up to 10% of disk size or 10 GiB by default; more when persistent. [mdn-quota] |
| Never lose offline data | **Yes.** The system does not evict files in a user's folder (inferred). [mdn-quota] | **Partly.** Browser-private data can be evicted when space is low unless persistent storage is granted, which the browser decides silently. The user can always clear it. Files saved to a local folder are not affected. [mdn-quota], [webdev-persist] | **No** as a Safari tab: data is deleted after seven days of Safari use without a visit. **Partly** when added to the Dock: exempt from that rule (inferred for the Dock), but low-space eviction and user clearing remain. [webkit-itp], [webkit-itp-2020], [webkit-storage] | **Partly.** Browser-private data can be evicted when space is low unless the user accepts the persistent storage prompt. The user can always clear it. [mdn-quota], [webdev-persist] |
| Start with no network after the first visit | **Yes.** Nothing is fetched at start-up (inferred). [mdn-sw] | **Yes.** The service worker serves the cached app. [mdn-offline], [mdn-sw] | **Partly.** Yes when added to the Dock. As a Safari tab the cached app falls under the seven-day rule. [webkit-s17], [webkit-itp] | **Yes.** The service worker serves the cached app. [mdn-offline], [mdn-sw] |
| Work with no network on first launch | **Yes.** After the app has been downloaded and installed (inferred). [mdn-sw] | **No.** The first visit must be online so the app can be fetched and cached. [mdn-sw] | **No.** The first visit must be online, and so must adding to the Dock (inferred for the Dock). [mdn-sw], [webkit-s17] | **No.** The first visit must be online so the app can be fetched and cached. [mdn-sw] |
| Sync or receive changes while closed | **Yes.** Can run with no window open and start at sign-in, if the user allows it. [apple-login], [ms-startup] | **Partly.** A pending send can finish when the network returns. An installed app may refresh at times the browser chooses. Push must show a notification. Nothing runs continuously. [bcd-sync], [chrome-periodic], [mdn-offline] | **No.** No background sync of any kind. Push only, with a visible notification. [bcd-sync], [bcd-periodic], [bcd-push] | **No.** No background sync of any kind. Push only, with a visible notification. [bcd-sync], [bcd-periodic], [bcd-push] |

## Open questions

These were not settled by the sources opened.

1. **Chromium, return visits.** After "allow on every visit", does the user still need to click before the app can use the folder on each visit? Chrome's article does not say ([chrome-persist]). A hands-on test would settle it.
2. **Safari, persistent storage and the seven-day rule.** Does persistent storage protect a Safari tab from the seven-day deletion? Does the Home Screen exemption cover Dock web apps on a Mac? Is OPFS covered by the rule? WebKit's pages do not say ([webkit-itp], [webkit-storage]).
3. **Chromium, browser not running.** Do background sync and push events arrive on a desktop computer when the browser is fully closed? Not stated in the pages opened.
4. **Edge.** That Edge shows the same permission prompts as Chrome is inferred from shared support data, not from a Microsoft source.
5. **How well the change observer works in practice.** For example with file-sync tools, or with editors that save by replacing a file. The sources give the design and its limits, not measured behaviour.
6. **Mobile browsers** were out of scope for this ticket.
7. **Firefox web apps.** Mozilla's support article on the feature would not load in the tools used. The facts here come from Firefox's source documentation ([fx-webapps]).

## Sources

All opened on 26 November 2026. Where a page shows its own date, it is given.

**Browser support data (MDN browser-compat-data, `main`, last commit 25 November 2026)**

- [bcd-window] — pickers.
- [bcd-handle] — permission methods on handles.
- [bcd-observer] — `FileSystemObserver`.
- [bcd-filehandle] — write stream and file handle methods.
- [bcd-storage] — storage estimate, persistence, OPFS entry point.
- [bcd-input] — folder import through a file input.
- [bcd-dnd] — files and folders dragged into a page.
- [bcd-launch] — opening files from the operating system.
- [bcd-sync], [bcd-periodic], [bcd-bgfetch], [bcd-push] — background features.

**MDN**

- [mdn-fsapi] — File System API overview. Last modified 12 September 2026.
- [mdn-picker] — `showDirectoryPicker`. Last modified 11 September 2026.
- [mdn-observer] — `FileSystemObserver`. Last modified 4 July 2025.
- [mdn-writable] — `createWritable`. Last modified 4 July 2025.
- [mdn-opfs] — origin private file system. Last modified 14 July 2025.
- [mdn-quota] — storage quotas and eviction criteria. Last modified 5 January 2026.
- [mdn-install] — installing web apps. Last modified 17 September 2026.
- [mdn-installable] — making web apps installable. Last modified 6 October 2026.
- [mdn-offline] — offline and background operation. Last modified 13 September 2026.
- [mdn-sw] — using service workers. Last modified 25 September 2026.
- [mdn-bgsync] — Background Synchronization API. Last modified 22 April 2024.

**Specification**

- [wicg-fsa] — File System Access, Draft Community Group Report, 10 October 2025.

**Chrome, Chromium and Edge**

- [chrome-fsa] — File System Access API guide. Published 19 August 2024.
- [chrome-persist] — persistent permissions for the File System Access API.
- [chrome-observer] — File System Observer article.
- [chromestatus-observer] — Chrome Platform Status entry for `FileSystemObserver`. Updated 10 January 2025.
- [chromium-blocklist] — Chromium source, list of blocked folders. File last changed 20 November 2026.
- [chrome-filehandling] — File Handling API guide.
- [chrome-periodic] — Periodic Background Sync guide.
- [chrome-help-apps] — Chrome Help, using web apps.
- [edge-bg] — Microsoft Edge, background sync for web apps. Updated 2 September 2026.
- [webdev-persist] — web.dev, persistent storage.
- [webdev-storage] — web.dev, storage for the web.

**Safari and WebKit**

- [webkit-storage] — updates to storage policy. Published 10 August 2023.
- [webkit-itp] — tracking prevention in WebKit.
- [webkit-itp-2020] — seven-day cap announcement. Published 24 March 2020.
- [webkit-s17] — WebKit features in Safari 17.0, web apps on Mac.
- [webkit-s26] — WebKit features in Safari 26.0.
- [webkit-position] — WebKit standards position on local file access. Position set 23 February 2023; latest comment 6 October 2026.
- [apple-webapps] — Apple Support, Safari web apps on Mac. Published 27 May 2026.
- [apple-wwdc26] — Apple, "What's new in WebKit for Safari 27".

**Firefox and Mozilla**

- [moz-position] — Mozilla standards position on File System Access. Labelled 13 September 2024.
- [moz-observer] — Mozilla standards position on `FileSystemObserver`. Labelled 16 May 2024.
- [fx-webapps] — Firefox source documentation, web apps in Firefox.

**Operating systems**

- [apple-fsevents] — Apple, File System Events.
- [apple-sandbox] — Apple, accessing files from the macOS App Sandbox.
- [apple-files] — Apple, control access to files and folders on Mac.
- [apple-login] — Apple, login items and background activity settings.
- [ms-watch] — Microsoft, `ReadDirectoryChangesW`. Updated 1 July 2025.
- [ms-startup] — Microsoft, configure startup applications in Windows.
- [linux-inotify] — Linux manual, inotify.

[bcd-window]: https://github.com/mdn/browser-compat-data/blob/main/api/Window.json
[bcd-handle]: https://github.com/mdn/browser-compat-data/blob/main/api/FileSystemHandle.json
[bcd-observer]: https://github.com/mdn/browser-compat-data/blob/main/api/FileSystemObserver.json
[bcd-filehandle]: https://github.com/mdn/browser-compat-data/blob/main/api/FileSystemFileHandle.json
[bcd-storage]: https://github.com/mdn/browser-compat-data/blob/main/api/StorageManager.json
[bcd-input]: https://github.com/mdn/browser-compat-data/blob/main/api/HTMLInputElement.json
[bcd-dnd]: https://github.com/mdn/browser-compat-data/blob/main/api/DataTransferItem.json
[bcd-launch]: https://github.com/mdn/browser-compat-data/blob/main/api/LaunchQueue.json
[bcd-sync]: https://github.com/mdn/browser-compat-data/blob/main/api/SyncManager.json
[bcd-periodic]: https://github.com/mdn/browser-compat-data/blob/main/api/PeriodicSyncManager.json
[bcd-bgfetch]: https://github.com/mdn/browser-compat-data/blob/main/api/BackgroundFetchManager.json
[bcd-push]: https://github.com/mdn/browser-compat-data/blob/main/api/PushManager.json
[mdn-fsapi]: https://developer.mozilla.org/en-US/docs/Web/API/File_System_API
[mdn-picker]: https://developer.mozilla.org/en-US/docs/Web/API/Window/showDirectoryPicker
[mdn-observer]: https://developer.mozilla.org/en-US/docs/Web/API/FileSystemObserver
[mdn-writable]: https://developer.mozilla.org/en-US/docs/Web/API/FileSystemFileHandle/createWritable
[mdn-opfs]: https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system
[mdn-quota]: https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria
[mdn-install]: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Installing
[mdn-installable]: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Making_PWAs_installable
[mdn-offline]: https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps/Guides/Offline_and_background_operation
[mdn-sw]: https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
[mdn-bgsync]: https://developer.mozilla.org/en-US/docs/Web/API/Background_Synchronization_API
[wicg-fsa]: https://wicg.github.io/file-system-access/
[chrome-fsa]: https://developer.chrome.com/docs/capabilities/web-apis/file-system-access
[chrome-persist]: https://developer.chrome.com/blog/persistent-permissions-for-the-file-system-access-api
[chrome-observer]: https://developer.chrome.com/blog/file-system-observer
[chromestatus-observer]: https://chromestatus.com/feature/4622243656630272
[chromium-blocklist]: https://github.com/chromium/chromium/blob/main/chrome/browser/file_system_access/chrome_file_system_access_permission_context.cc
[chrome-filehandling]: https://developer.chrome.com/docs/capabilities/web-apis/file-handling
[chrome-periodic]: https://developer.chrome.com/docs/capabilities/periodic-background-sync
[chrome-help-apps]: https://support.google.com/chrome/answer/9658361
[edge-bg]: https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps/how-to/background-syncs
[webdev-persist]: https://web.dev/articles/persistent-storage
[webdev-storage]: https://web.dev/articles/storage-for-the-web
[webkit-storage]: https://webkit.org/blog/14403/updates-to-storage-policy/
[webkit-itp]: https://webkit.org/tracking-prevention/
[webkit-itp-2020]: https://webkit.org/blog/10218/full-third-party-cookie-blocking-and-more/
[webkit-s17]: https://webkit.org/blog/14445/webkit-features-in-safari-17-0/
[webkit-s26]: https://webkit.org/blog/17333/webkit-features-in-safari-26-0/
[webkit-position]: https://github.com/WebKit/standards-positions/issues/28
[apple-webapps]: https://support.apple.com/en-us/104996
[apple-wwdc26]: https://developer.apple.com/videos/play/wwdc2026/204/
[moz-position]: https://github.com/mozilla/standards-positions/issues/154
[moz-observer]: https://github.com/mozilla/standards-positions/issues/942
[fx-webapps]: https://firefox-source-docs.mozilla.org/browser/components/taskbartabs/docs/index.html
[apple-fsevents]: https://developer.apple.com/documentation/coreservices/file_system_events
[apple-sandbox]: https://developer.apple.com/documentation/security/accessing-files-from-the-macos-app-sandbox
[apple-files]: https://support.apple.com/guide/mac-help/control-access-to-files-and-folders-on-mac-mchld5a35146/mac
[apple-login]: https://support.apple.com/guide/mac-help/change-login-items-extensions-settings-mtusr003/mac
[ms-watch]: https://learn.microsoft.com/en-us/windows/win32/api/winbase/nf-winbase-readdirectorychangesw
[ms-startup]: https://support.microsoft.com/en-us/windows/configure-startup-applications-in-windows-115a420a-0bff-4a6f-90e0-1934c844e473
[linux-inotify]: https://man7.org/linux/man-pages/man7/inotify.7.html
