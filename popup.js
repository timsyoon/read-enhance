// Initialize the custom background color and text color pickers
let bg_color_button = document.getElementById('bg-color');
let text_color_button = document.getElementById('text-color');

// Prepopulate the values of the color pickers from storage
chrome.storage.local.get(['bg_color', 'text_color'], function(result) {
  if (result.bg_color) {
    bg_color_button.setAttribute('value', result.bg_color);
  }
  if (result.text_color) {
    text_color_button.setAttribute('value', result.text_color);
  }
});

// Initialize the theme buttons
let warm_button = document.getElementById('warm-theme');
let cool_button = document.getElementById('cool-theme');
let dark_button = document.getElementById('dark-theme');
let light_button = document.getElementById('light-theme');

// Determine which theme button should be selected, if any
chrome.storage.local.get(['theme'], function(result) {
  let theme = result.theme;
  if (theme) {
    if (theme === 'warm') {
      warm_button.setAttribute('checked', 'checked');
    }
    else if (theme === 'cool') {
      cool_button.setAttribute('checked', 'checked');
    }
    else if (theme === 'dark') {
      dark_button.setAttribute('checked', 'checked');
    }
    else if (theme === 'light') {
      light_button.setAttribute('checked', 'checked');
    }
  }
});

// Apply a theme to the web page if a theme button is clicked
warm_button.addEventListener('click', applyTheme);
cool_button.addEventListener('click', applyTheme);
dark_button.addEventListener('click', applyTheme);
light_button.addEventListener('click', applyTheme);

function applyTheme() {
  let peach_hex = '#ffddb3';
  let black_hex = '#000000';
  let blue_hex = '#d1edff';
  let valhalla_hex = '#272438';
  let white_hex = '#f4f4f4';

  // Content script to inject programatically for the warm theme
  let warm_theme_script = " \
  var peach_hex = \'#ffddb3\'; \
  var black_hex = \'#000000\'; \
  var allElements = document.getElementsByTagName(\'*\'); \
  for (let i = 0; i < allElements.length; i++) { \
    allElements[i].style.backgroundColor = peach_hex; \
    allElements[i].style.color = black_hex; \
  }"

  // Content script to inject programatically for the cool theme
  let cool_theme_script = " \
  var blue_hex = \'#d1edff\'; \
  var black_hex = \'#000000\'; \
  var allElements = document.getElementsByTagName(\'*\'); \
  for (let i = 0; i < allElements.length; i++) { \
    allElements[i].style.backgroundColor = blue_hex; \
    allElements[i].style.color = black_hex; \
  }"

  // Content script to inject programatically for the dark theme
  let dark_theme_script = " \
  var valhalla_hex = \'#272438\'; \
  var white_hex = \'#f4f4f4\'; \
  var allElements = document.getElementsByTagName(\'*\'); \
  for (let i = 0; i < allElements.length; i++) { \
    allElements[i].style.backgroundColor = valhalla_hex; \
    allElements[i].style.color = white_hex; \
  }"

  // Content script to inject programatically for the light theme
  let light_theme_script = " \
  var white_hex = \'#f4f4f4\'; \
  var valhalla_hex = \'#272438\'; \
  var allElements = document.getElementsByTagName(\'*\'); \
  for (let i = 0; i < allElements.length; i++) { \
    allElements[i].style.backgroundColor = white_hex; \
    allElements[i].style.color = valhalla_hex; \
  }"

  let script_to_run = undefined;

  // Decide which script to run depending on which theme button was clicked
  if (warm_button.checked === true) {
    script_to_run = warm_theme_script;
    // Update the values stored in memory
    chrome.storage.local.set({bg_color: peach_hex, text_color: black_hex, theme: 'warm'}, function() {
      return;
    });
    // Change the values of the custom color pickers to match the theme colors
    bg_color_button.setAttribute('value', peach_hex);
    text_color_button.setAttribute('value', black_hex);
  }
  else if (cool_button.checked === true) {
    script_to_run = cool_theme_script;
    chrome.storage.local.set({bg_color: blue_hex, text_color: black_hex, theme: 'cool'}, function() {
      return;
    });
    bg_color_button.setAttribute('value', blue_hex);
    text_color_button.setAttribute('value', black_hex);
  }
  else if (dark_button.checked === true) {
    script_to_run = dark_theme_script;
    chrome.storage.local.set({bg_color: valhalla_hex, text_color: white_hex, theme: 'dark'}, function() {
      return;
    });
    bg_color_button.setAttribute('value', valhalla_hex);
    text_color_button.setAttribute('value', white_hex);
  }
  else if (light_button.checked === true) {
    script_to_run = light_theme_script;
    chrome.storage.local.set({bg_color: white_hex, text_color: valhalla_hex, theme: 'light'}, function() {
      return;
    });
    bg_color_button.setAttribute('value', white_hex);
    text_color_button.setAttribute('value', valhalla_hex);
  }

  // Run the script on the page
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {code: script_to_run}
    );
  });
}

// Change the background color of the page whenever the color picker is updated
bg_color_button.addEventListener('input', updateBgColor, false);

function updateBgColor(event) {
  // Store the new color locally
  let new_bg_color = event.target.value;
  chrome.storage.local.set({bg_color: new_bg_color}, function() {
    return;
  });

  // Update the value of the color picker
  bg_color_button.setAttribute('value', new_bg_color);

  // Content script to inject programmatically
  let update_bg_color_script = " \
  chrome.storage.local.get([\'bg_color\'], function(result) { \
    var bg_color = result.bg_color; \
    var allElements = document.getElementsByTagName(\'*\'); \
    for (let i = 0; i < allElements.length; i++) { \
      allElements[i].style.backgroundColor = bg_color; \
    } \
  });"

  // Run the script
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {code: update_bg_color_script}
    );
  });
}

// Change the text color of the page whenever the color picker is updated
text_color_button.addEventListener('input', updateTextColor, false);

// Change the text color of the page based on the color picker
function updateTextColor(event) {
  // Store the new color locally
  let new_text_color = event.target.value;
  chrome.storage.local.set({text_color: new_text_color}, function() {
    return;
  });

  // Content script to inject programmatically
  let update_text_color_script = " \
  chrome.storage.local.get([\'text_color\'], function(result) { \
    var text_color = result.text_color; \
    var allElements = document.getElementsByTagName(\'*\'); \
    for (let i = 0; i < allElements.length; i++) { \
      allElements[i].style.color = text_color; \
    } \
  });"
  
  // Run the script
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.executeScript(
      tabs[0].id,
      {code: update_text_color_script}
    );
  });
}
