# Iteration feedback items

## Addresses iterations 17 - 22
- Scrollbars really stand out in this UI. Reset their styles and use existing color grade to neutralize them. Consider tablet UIs - rarely are their scrollbars.
- Map alerts overlay - chonky boi. Should be more lightweight visually. No scrollbars. Account for exactly three alerts and set height accordingly.
    - We need to handle cases where more than three alerts are pushed to state. Does this scroll?
- Video overlay - Explore interaction options: 
    - start paused vs start running. click/tap to stat/stop
    - click/tap video or vehicle camera name row to expand
- Vehicle route lines are super thick. Maybe reduce?
- Desert terrain - should be an actual sat image. Zooming in should change scale of map as well as relative vehicle marker positions.
    - Explore and list solutions for a terrain engine using real sat tile data.
- Vehicle list panel - First vehicle card has blue left border. After selecting the third vehicle card, this newly selected vehicle card does not get the added left border; and the previously selected vehicle card still has its left border.
- Vehicle details panel - connection and battery take up a lot of valuable room. Reduce Find an intelligent way to consolidate so we get more vertical space back.
- Vehicle/Events tabs  - lots of space above them. How about pushing those into the toolbar with a soft boundary on the left side to separate them from the other toolbar items.

## Addresses iterations 23 - 30
- active alerts - 3 are visible. When there are more than 3, the count updates and scrollbars do not appear. 
- camera video 
    - Tapping bar should toggle docked/expanded.
    - Tapping the video itself should toggle pause/play.
    - Position in center of map may not be the best location. Let's look at alternatives.
- Mapping system [FIXED]
    - RouteOverlay.tsx Deleted (replaced by Leaflet Polyline) - this looks good but the route lines are way too thin. Can visible route line thickness be changed? 
- Vehicle List - mapped border colors with vehicle state
    This one could use a rework. It's not super clear and it might be hard to get comfortable with.
    - Left border = autonomy state
    - Top border = connection state
    - Selection = background + accent border

## iterations 31-35
- Panels 
    - Borders: all the rounded corners take up more space. I appreciate the small design touches that rounded corners afford us, but we need to reduce those.
- Fleet panel vehicle Cards
    - Combine vehicle ID and Name. Format: "ID: Name"
- Events
    - Layout rules should enforce no horizontal scroll.
    - Time and VehicleId should be on same row - time left-aligned, id right-aligned, leaving an entire row (or more) for message.

## UI Fine tuning
- Map - Set the zoom to default to the closest zoom that shows all vehicle markers in the view.