let idxToZoomTable = {
    0: 0.5,
    1: 0.75,
    2: 1.0,
    3: 1.25,
    4: 1.5,
    5: 2.0,
    6: 3.0,
    7: 4.0,
    // 8: fit to page
    // 9: custom
};

function selectedIndexToZoomLevel() {
    let zoom_select = document.getElementById("default_zoom");
    let idx = zoom_select.selectedIndex;
    var zoom_level = 1.0;
    if(idx <= 7)
    {
        zoom_level = idxToZoomTable[idx];
    }
    else if(idx == 9)
    {
        zoom_level = document.getElementById("custom_zoom").value / 100
    }
    return zoom_level;
}

function zoomLevelToSelectedIndex(level)
{
    for(var key in idxToZoomTable)
    {
        if(idxToZoomTable[key] === level)
        {
            return key;
        }
    }
    return null;
}

function toggleZoomInput(evt)
{
    let selectedIndex = evt.target.selectedIndex;
    let customZoomInput = document.getElementById("custom_zoom_input");
    if(selectedIndex === 9) // Custom...
    {
        customZoomInput.style.display = "inline-block";
    }
    else
    {
        customZoomInput.style.display = "none";
    }
}

function saveOptions(e) {
    e.preventDefault();

    var zoom_select = document.getElementById("default_zoom");
    var zoom_level = selectedIndexToZoomLevel();
    var fit_to_page = false;
    if(zoom_level === null || zoom_select.selectedIndex === 8)
    {
        fit_to_page = true;
    }

    browser.storage.local.set({
      centersvg_enabled: document.querySelector("#enabled").checked,
      centersvg_show_backdrop: document.querySelector("#show_backdrop").checked,
      centersvg_zoom_level: zoom_level,
      centersvg_fit_to_page: fit_to_page,
      centersvg_custom_zoom_level: zoom_select.selectedIndex === 9
    });
  }

  function restoreOptions() {

    function setCurrentChoice(result) {
      if(result.centersvg_enabled === undefined)
      {
        result = {
            centersvg_enabled: true,
            centersvg_show_backdrop: true,
            centersvg_zoom_level: 1.0,
            centersvg_fit_to_page: true,
            centersvg_custom_zoom_level: false
        };
        // Set default settings
        browser.storage.local.set(result);
      }
      var zoom_level_idx = 0;
      if(result.centersvg_fit_to_page)
      {
        zoom_level_idx = 8;
      }
      else
      {
        var zoom_level_idx = zoomLevelToSelectedIndex(result.centersvg_zoom_level);
        if(zoom_level_idx === null)
        {
            if(result.centersvg_custom_zoom_level)
            {
                zoom_level_idx = 9;
                document.querySelector("#custom_zoom").value = result.centersvg_zoom_level * 100;
            }
        }
      }
      document.querySelector("#enabled").checked = result.centersvg_enabled;
      document.querySelector("#show_backdrop").checked = result.centersvg_show_backdrop;
      document.querySelector("#default_zoom").selectedIndex = zoom_level_idx;
      document.querySelector("#custom_zoom_input").style.display = result.centersvg_custom_zoom_level ? "inline-block" : "none";
    }

    function onError(error) {
      console.log(`Error: ${error}`);
    }

    let storage_keys = ["centersvg_enabled",
                        "centersvg_show_backdrop",
                        "centersvg_zoom_level",
                        "centersvg_custom_zoom_level",
                        "centersvg_fit_to_page"];
    browser.storage.local.get(storage_keys).then(setCurrentChoice, onError);
  }

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.querySelector("#default_zoom").addEventListener("change", toggleZoomInput);