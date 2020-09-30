<!-- @format -->

# FlowBookmarks - Multicolor bookmark

### Please reload after installing it. Press cmd+shift+P or ctrl+shift+P and enter reload and select the option to Reload

It helps you to navigate through your code for a particular flow like Activation, Order Placement, Cancellation or whatever flow you work on.
Create **bookmarks** for a particular **flow**, _each flow with different color_, navigate to any bookmark anytime easily.

![Demo](https://github.com/deepakpahwa19/flow-bookmarks/blob/master/images/bookmark-vscode.png?raw=true)

## Supports all languages suppported by VSCode
  1. **JavaScript**
  2. **Java**
  3. **Python**
  4. **C/C++**
  5. **CSS**
  6. **HTML** etc.

## Supports all frameworks suppported by VSCode
  1. **React**
  2. **Angular**
  3. **Vue**
  4. **Spring Boot**
  5. **Django**
  6. **Flask** etc.

## Please suggest new feature or create issues here: https://github.com/deepakpahwa19/flow-bookmarks/issues

List of Features:

## Features

- Add a **bookmark** for a **flow**, mention **index** for bookmark.
- Edit a bookmark like change the flow name or index or even bookmark name.
- All bookmarks are sorted as per their index, makes it easy to navigate through the flow anytime.
- Clear a bookmark
- Clear All bookmarks at once
- Multi-color support. upto 10 colors to choose from.
- All bookmarks for a flow will use single color, makes it easy to identify in the file.
- A sidebar to navigate through the bookmarks and files.

## Extension Settings

FlowBookmarks provides you feature to choose from 10 colors to display, one color for each flow. Just add below lines in your settings.json with the maximum length of 10 in any order. Default is five colors.

```
"flowbookmark.listOfColors": ['blue',  'aqua', 'orange', 'purple', 'yellow', 'persiangreen', 'green', 'pink', 'red','brown']
```

Default Colors: ['blue', 'red', 'pink', 'purple', 'yellow']

Available colors:
['blue', 'green', 'pink', 'red', 'aqua', 'orange', 'purple', 'yellow', 'persiangreen', 'brown']

Please reload after making changes in setting.json

## Commands

- _FB: Add Bookmark_
- _FB: Clear This Bookmark_
- _FB: Clear All Bookmarks_

## Add a Bookmark

1. Press cmd+shift+p (mac) or ctrl+shift+p (windows)
2. Type "add bookmark"
3. Select "FB: Add Bookmark"
4. Enter bookmarkName, FlowName (optional), index(optional)

<!-- ![Add a Bookmark]("https://github.com/deepakpahwa19/flow-bookmarks/blob/master/images/FB-AddBookmark.gif") -->

![AddBookmark](https://github.com/deepakpahwa19/flow-bookmarks/blob/master/images/FB-AddBookmark-min.gif?raw=true)

## Edit a Bookmark or Flow

1. Go to Bookmark sidebar
2. Click on pencil while hovering on any bookmark
3. Change anything, bookmarkName, FlowName and/or index

<!-- ![Edit a Bookmark]("images/Edit-Bookmark-Flow.gif") -->

![EditBookmark](https://github.com/deepakpahwa19/flow-bookmarks/blob/master/images/Edit-Bookmark-Flow-min.gif?raw=true)

## Clear a Bookmark

1. Select a line which has bookmark
2. Press cmd+shift+p (mac) or ctrl+shift+p (windows)
3. Type "clear bookmark"
4. Select "FB: Clear Bookmark"

<!-- ![Clear This Bookmark]("images/Clear-this-Bookmark.gif") -->

![ClearBookmark](https://github.com/deepakpahwa19/flow-bookmarks/blob/master/images/Clear-this-Bookmark-min.gif?raw=true)
