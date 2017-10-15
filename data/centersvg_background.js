browser.runtime.onMessage.addListener(function(m, s) {
    var onPropFail = function()
    {
        console.log("centersvg: Failed to get property!");
    }
    if(m.reason == "request_state")
    {
        let keys = ["centersvg_enabled", "centersvg_show_backdrop", "centersvg_zoom_level", "centersvg_fit_to_page"];
        browser.storage.local.get(keys).then(function(setting) {
            browser.tabs.sendMessage(s.tab.id, {
                reason: "state_change",
                enabled: setting.centersvg_enabled,
                show_backdrop: setting.centersvg_show_backdrop,
                zoom_level: setting.centersvg_zoom_level,
                fit_to_page: setting.centersvg_fit_to_page
            });
        }, onPropFail);
    }
});