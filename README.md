# Daily

A tiny, personal calisthenics app built for one thing: **showing up every day.**

- Bodyweight only, no equipment, and very beginner friendly
- About 8 minutes, 6 moves, one at a time with a built-in timer
- Three gentle routines take turns day by day (push & legs, back & balance, core & mobility), so no muscle gets hit two days in a row
- The amounts stay well short of failure, so you can train every day without getting sore
- An animated figure shows how each move is done. Tap any move on the home screen to preview it.
- Shows your streak and the last 7 days. That's it.
- Three levels: Gentle, Steady, Strong. After 14 sessions it suggests moving up, but only when the current level feels easy.
- Works offline, with no account. Your data stays on your phone (localStorage).

## Use it on your iPhone

1. Host the folder anywhere static. GitHub Pages is easiest: repo **Settings → Pages → Deploy from branch**.
2. Open the URL in Safari, tap **Share → Add to Home Screen**.

## Change the workouts

Edit `ROUTINES` at the top of the script in `index.html`. Each move has three amounts, one per level:
`t` for seconds, `r` for reps, and `side: true` for per side. The animated figures live in `figures.js`, one pose pair per move, keyed by the move's name.
After changing files, bump `VERSION` in `sw.js`.
