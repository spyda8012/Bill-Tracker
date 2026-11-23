# Bill Tracker

A personal bill tracker in a single HTML file. Live at https://spyda8012.github.io/Bill-Tracker/ (or open `index.html` in any browser).

- Add, edit, delete bills (name, amount, due date, category, paid/unpaid, notes)
- **Recurring bills**: weekly, every 2 weeks, monthly, every 3 or 6 months, yearly. Marking one paid adds the next one.
- **Autopay** flag: autopay bills mark themselves paid on the due date
- **Payment link**: a "Pay" button that opens the biller's site
- **Payment history**: when each bill was paid, how much, and whether it was late
- **Calendar** view of due dates, including expected repeats
- **Reminders**: add bills to your phone calendar with alerts (.ics), and app notifications
- Overdue, due in 7 days and total unpaid at a glance; search, filter and sort
- Monthly totals by category
- Export/import a backup (JSON) and export a spreadsheet (CSV)
- Installable: on iPhone use Share → Add to Home Screen; on Android use Install app. Works offline.

## Android app (APK)

The same app is also built as an Android app you can sideload. Every change to `main` rebuilds it automatically.

**Install or update:**
1. On your Android phone, open the [Latest Android app](https://github.com/spyda8012/Bill-Tracker/releases/tag/android-latest) release and tap **BillTracker.apk** to download it.
2. Open the downloaded file. If Android asks, allow your browser (or Files app) to **install unknown apps**, then go back and tap **Install**.
3. If Play Protect warns that it doesn't recognise the app, tap **More details → Install anyway**. It's flagged only because it isn't from the Play Store.

To update later, download and open the new APK the same way. It installs over the old one and keeps your bills. (Don't uninstall first: uninstalling deletes the app's data.)

**Moving bills from the browser version:** the app keeps its own data, separate from the browser. In the browser version tap Settings → **Export backup**, then in the app tap Settings → **Import backup** and pick that file.

The app works fully offline (the files are inside the APK) and reminds you with real notifications at 9 AM before and on each due date, even when it's closed. Export and CSV open the share sheet so you can save to Files or Drive.

How it's built: [Capacitor](https://capacitorjs.com) wraps `index.html` in an Android WebView. `npm run sync` copies the web files into `android/`, and `.github/workflows/android.yml` builds and signs the APK with the repo's `android/app/sideload.keystore` (a personal sideload key, not for the Play Store).

## Data

Data is saved in the browser on the device you use. Export a backup now and then.

Hosted with GitHub Pages (Settings → Pages → deploy from `main`).
