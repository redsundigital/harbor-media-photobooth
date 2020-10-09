## TODO 10/8/2020
- App is actually two separate apps, located at two different urls.
  - Camera app views: 
    1. qr code to bind remote app to camera app
    2. camera preview (video)
    3. photo results
  - Remote app views:
    1. "Welcome" screen that tells users to scan a qr code. This is all they can do for now.
      1.1 Welcome screen has a qr code scanner
    2. "Controls" screen with different controls for before and after pictures are taken
      (before)
      - Exit
      - Start Timer
      - Timer Setpoint
      - Filters (later?)

      (after)
      - Exit
      - Stop Timer (during timer countdown) | Redo
      - Save
      - Filters (later?)
      - Send (Email only right now)


## Camera View

- [x] Camera preview
  - [x] Display webcam output.
- [ ] Start Timer button
  - [ ] ? Short description of what to do ?
  - [ ] onClick: Start timer.
  - [ ] timer (5s): 
    1. takePicture().
    2. Show send view.

## Photo View

- [ ] Still image of takePicture() output.
  - [ ] full screen
- [ ] Toolbar (bottom, flex row, 80px h)
  - [ ] Overlayed on still image mentioned above.
  - [ ] Email input (left, flex 2, validation).
  - [ ] Send button (right, flex 1).
    - [ ] onClick: send image to email address from input. goto confirmation.
- [ ] Redo button
  - [ ] Top left, goes back to camera view.

## Confirmation

- [ ] Fullscreen solid gradient background
- [ ] Email sent status
- [ ] Redo button: go to camera view (reuse from photo view).

## Privacy

- [ ] Make users accept being put on a mailing list?