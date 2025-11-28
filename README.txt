
FINAL SITE STRUCTURE
--------------------
index.html                -> Main page (has: admission ticker, general photo slider, staff slider, staff list)
staff/photoslide/         -> Put general slider images here (any name)
staff/staffphotos/        -> Put staff photos here named staff1.jpg ... staff17.jpg (or update data/staff.json photo fields)
data/staff.json           -> Staff metadata (name, post, photo). Edit this to update staff details.
data/photos.json          -> Info about photos (not required). Slider auto-loads files from folders.

How it works:
- General Photo Slider: loads all images from staff/photoslide/
- Staff Slider: reads data/staff.json and expects matching images in staff/staffphotos/
- To update staff details: edit data/staff.json (name/post/photo)
- To update photos: replace images in the appropriate folders
