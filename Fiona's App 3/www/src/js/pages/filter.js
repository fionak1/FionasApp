PrivacyPolicy_MUA.f.p.Filter = Vue.component('Filter', function (resolve, reject) {
    fetch("./src/html/pages/filter.html").then(function (data) {
        data.text().then(function (html) {
            resolve({
                name: "Filter",
                template: html,
                data() {
                    return {
                        apps: [],
                        selectedApp: null,
                        selectedAppData: [],
                        selectedProperty: null,
                        state: 'appsList',
                        filterOptions: PrivacyPolicy_MUA.o.Filter.FilterOptions,
                    }
                },
                computed: {

                },
                methods: {
                    initialise: async function () {
                        let self = this;
                        let isFilterActive = false;
                        let filteredArray = [];
                        for (let i = 0; i < PrivacyPolicy_MUA.o.Filter.FilterOptions.length; i++) {
                            if (PrivacyPolicy_MUA.o.Filter.FilterOptions[i].checked == true) {
                                isFilterActive = true;
                            }
                        }
                        if (isFilterActive) {
                            let results = await PrivacyPolicy_MUA.f.p.AJAXCalls.getAllData();
                            let resultsArray = [];
                            for (let i = 0; i < results.length; i++) {
                                let dataObj = {
                                    "Name": results[i].Name,
                                    "ImageReference": results[i].ImageReference
                                };
                                resultsArray.push(dataObj);
                            }
                            filteredArray = _.sortBy(resultsArray, 'Name');
                            this.apps = filteredArray;
                        } else {
                            this.showDataList();
                        }
                    },
                    showApp: function (_app) {
                        this.selectedApp = _app;
                        this.state = 'app';
                        this.showSpecificData(_app);
                    },
                    formatData: function (_data) {
                        let formattedDataArray = [];
                        for (let key in _data) {
                            if (_data[key] != "{" && _data[key] != "}") {
                                formattedDataArray.push(_data[key]);
                            }
                        }
                        formattedDataArray = formattedDataArray.join('');
                        return JSON.parse(formattedDataArray);
                    },
                    changePage: function (_data) {
                        let that = this;
                        that.state = _data.Name;
                        that.selectedProperty = _data;
                    },
                    showDataList: async function () {
                        let results = await PrivacyPolicy_MUA.f.p.AJAXCalls.getAllData();
                        let resultsArray = [];
                        for (let i = 0; i < results.length; i++) {
                            let dataObj = {
                                "Name": results[i].Name,
                                "ImageReference": results[i].ImageReference
                            };
                            this.apps.push(dataObj);
                        }
                    },
                    showSpecificData: async function (_name) {
                        this.selectedAppData = [];
                        let results = await PrivacyPolicy_MUA.f.p.AJAXCalls.getSpecificData(_name.Name);
                        for (let i = 0; i < results.length; i++) {
                            let dataObj = {
                                "Name": results[i].Name,
                                "ImageReference": results[i].ImageReference,
                                "InformationCollected": results[i].InformationCollected,
                                "UsageOfInformation": results[i].UsageOfInformation,
                                "DisclosureOfInformation": results[i].DisclosureOfInformation,
                                "Rating": results[i].Rating,
                                "DataHeld": results[i].DataHeld,
                                "Age": results[i].Age,
                                "WebLink": results[i].WebLink,
                            };
                            this.selectedAppData.push(dataObj);
                        }
                    },
                    goBack: function () {
                        this.state = 'appsList';
                    }
                },
                mounted() {
                    this.initialise();
                },
                watch: {
                    'filterOptions': {
                        handler: function (_newVal) {
                            console.log("filter added");
                        }
                    }
                }
            })
        })
    })
});