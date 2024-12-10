function getMapsUrl() {
    const directionsButton = getDirectionsButton()
    if(directionsButton !== null) {
        return directionsButton.href;
    }
    const searchTerm = encodeURIComponent(getInputField().value);
    return `https://www.google.com/maps/search/${searchTerm}`;
}

function isLocationSearch() {
    const searchQuery = getInputField()?.value.toLowerCase() || '';
    const locationKeywords = ['near', 'in', 'at', 'location', 'address', 'where', 'place', 'directions'];

    const locationInfobox = getTravelLayout();
    const directionsButton = getDirectionsButton();

    return locationInfobox !== null || directionsButton != null || locationKeywords.some(keyword => searchQuery.includes(keyword));
}

function getDirectionsButton() {
    return document.querySelector('a[href*="/maps"]');
}

function getTravelLayout() {
    return document.querySelector("div[data-ly='/travel_layout/map_2modules']");
}

function getInputField() {
    return document.querySelector('input[name="q"]');
}

function createMapsTab() {
    console.log("bringbackmaps: creating maps tab");
    const tabsContainer = document.querySelector('div[role="navigation"] div[role="list"]');
    if (!tabsContainer || document.querySelector('.maps-tab-restored')) return;

    const mapsUrl = getMapsUrl();

    // Find an existing tab to clone its structure
    const existingTab = tabsContainer.querySelector('div[role="navigation"] div[role="listitem"]:has(> a:not([aria-disabled="true"]))');

    if (!existingTab) return;

    const mapsTab = existingTab.cloneNode(true);

    const linkToMaps = mapsTab.querySelector('a');
    if (linkToMaps) {
        linkToMaps.href = mapsUrl;
        linkToMaps.setAttribute("data-ved", undefined)
        linkToMaps.setAttribute("data-hveid", undefined)
    }

    const linkContent = linkToMaps.querySelector("div")
    linkContent.textContent = "Maps"

    // Insert after Images tab (estimation)
    const imagesListItem = Array.from(tabsContainer.querySelectorAll('div[role="listitem"]'))[1]

    if (imagesListItem) {
        imagesListItem.after(mapsTab);
    } else {
        tabsContainer.appendChild(mapsTab);
    }
}

function makeImageClickable() {
    const travelLayout = getTravelLayout()
    if(!travelLayout) return;
    const mapsImage = travelLayout.querySelector("img:not(ol img)");
    const parent = mapsImage.parentElement;

    const a = document.createElement("a")
    a.href = getMapsUrl()

    const removed = parent.removeChild(mapsImage)
    a.appendChild(removed)
    parent.appendChild(a)
}

function init() {
    if (isLocationSearch()) {
        const observer = new MutationObserver((mutations, obs) => {
            const tabsContainer = document.querySelector('div[role="navigation"] div[role="list"]');
            if (tabsContainer) {
                createMapsTab();
                obs.disconnect();
                makeImageClickable();
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
