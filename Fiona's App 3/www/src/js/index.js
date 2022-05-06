const routes = [{
    path: '/',
    component: PrivacyPolicy_MUA.f.p.HomePage,
    name: 'Home Page'
}, {
    path: '/filter',
    component: PrivacyPolicy_MUA.f.p.Filter,
    name: 'Filter'
}, {
    path: '/search',
    component: PrivacyPolicy_MUA.f.p.Search,
    name: 'Search'
}, {
    path: '/settings',
    component: PrivacyPolicy_MUA.f.p.Settings,
    name: 'Settings'
}, {
    path: '/comparison',
    component: PrivacyPolicy_MUA.f.p.Comparison,
    name: 'Comparison'
}, {
    path: '/pia',
    component: PrivacyPolicy_MUA.f.p.PIA,
    name: 'P.I.A'
}];
const router = new VueRouter({
    routes: routes
});

PrivacyPolicy_MUA.f.p.Index = new Vue({
    el: '#app',
    router,
    components: {},
    data() {
        return {
            isFilterFrontPage: PrivacyPolicy_MUA.o.Filter.isFilterFrontPage,
            filterOptions: PrivacyPolicy_MUA.o.Filter.FilterOptions,
            selectedFilterOption: null
        }
    },
    methods: {
        initialise: function () {
            window.screen.orientation.lock('portrait');
        },
        openMenu: function () {
            let panel = PrivacyPolicy_MUA.o.AppData.Framework7.panel.create({
                el: '.panel-left',
                resizable: true,
                visibleBreakpoint: 1024,
                collapsedBreakpoint: 768,
            })
            PrivacyPolicy_MUA.o.AppData.Framework7.panel.open(panel, true);

        },
        selectFilterOption: function (_filterOption) {
            this.selectedFilterOption = _filterOption;
            for (let i = 0; i < PrivacyPolicy_MUA.o.Filter.FilterOptions.length; i++) {
                if (PrivacyPolicy_MUA.o.Filter.FilterOptions[i].id == _filterOption.id) {
                    PrivacyPolicy_MUA.o.Filter.FilterOptions[i].checked = true;
                } else {
                    PrivacyPolicy_MUA.o.Filter.FilterOptions[i].checked = false;
                }
            }
        },
        clearFilters: function () {
            for (let i; i < PrivacyPolicy_MUA.o.Filter.FilterOptions.length; i++) {
                PrivacyPolicy_MUA.o.Filter.FilterOptions[i].checked = false;
            }
            this.selectedFilterOption = null;
        },
        closePopup: function () {
            PrivacyPolicy_MUA.o.AppData.Framework7.popup.close();
            // location.reload();
        }
    },
    computed: {},
    mounted() {
        // Vue Reference
        let self = this;
        // Initialise Function
        self.initialise();
        // Initialise framework 7
        PrivacyPolicy_MUA.o.AppData.Framework7 = new Framework7({

            // App root element
            root: '#app',
            // App Name
            name: 'PrivacyPolicy',
            // App id
            id: 'com.privacy.policy',
            panel: {
                swipe: false,
                visibleBreakpoint: 1024,
            }
        });

    },
})