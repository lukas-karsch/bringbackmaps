function isLocationSearch() {
    const searchQuery = document.querySelector('input[name="q"]')?.value.toLowerCase() || '';
    const locationKeywords = ['near', 'in', 'at', 'location', 'address', 'where', 'place', 'directions'];

    const locationInfobox = document.querySelector("div[data-ly='/travel_layout/map_2modules']")
    console.log({locationInfobox})

    return locationInfobox || locationKeywords.some(keyword => searchQuery.includes(keyword));
}

function createMapsTab() {
    console.log("createMapsTab")
    const tabsContainer = document.querySelector('div[role="navigation"] div[role="list"]');
    console.log({tabsContainer})
    if (!tabsContainer || document.querySelector('.maps-tab-restored')) return;

    const searchTerm = encodeURIComponent(document.querySelector('input[name="q"]').value);
    const mapsUrl = `https://www.google.com/maps/search/${searchTerm}`;
    console.log({mapsUrl})

    // Find an existing tab to clone its structure
    const existingTab = tabsContainer.querySelector('div[role="navigation"] div[role="listitem"]:has(> a:not([aria-disabled="true"]))');
    console.log({existingTab})
    if (!existingTab) return;

    const mapsTab = existingTab.cloneNode(true);
    // mapsTab.className = 'maps-tab-restored';

    const linkToMaps = mapsTab.querySelector('a');
    if (linkToMaps) {
        linkToMaps.href = mapsUrl;
        linkToMaps.setAttribute("data-ved", undefined)
        linkToMaps.setAttribute("data-hveid", undefined)
    }

    const linkContent = linkToMaps.querySelector("div")
    linkContent.textContent = "Maps"

    // Insert after Images tab (guess)
    const imagesListItem = Array.from(tabsContainer.querySelectorAll('div[role="listitem"]'))[1]

    if (imagesListItem) {
        imagesListItem.after(mapsTab);
    } else {
        tabsContainer.appendChild(mapsTab);
    }
}

function init() {
    console.log("init")
    if (isLocationSearch()) {
        console.log("seems to be location search")
        const observer = new MutationObserver((mutations, obs) => {
            const tabsContainer = document.querySelector('div[role="navigation"] div[role="list"]');
            if (tabsContainer) {
                createMapsTab();
                obs.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
}

init();
const originalPushState = history.pushState;
history.pushState = function() {
    originalPushState.apply(this, arguments);
    setTimeout(init, 100);
};
