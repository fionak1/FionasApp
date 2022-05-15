PrivacyPolicy_MUA.f.p.Search = Vue.component('Search', function (resolve, reject) {
    fetch("./src/html/pages/search.html").then(function (data) {
        data.text().then(function (html) {
            resolve({
                name: "Search",
                template: html,
                data() {
                    return {
                        Search: {
                            Query: null,
                        },
                        apps: [],
                        filteredApps: [],
                        selectedAppData: [],
                        appDetails: false
                    }
                },
                computed: {

                },
                methods: {
                    showDataList: async function () {
                        let self = this;
                        try {
                            let results = await PrivacyPolicy_MUA.f.p.AJAXCalls.getAllData();
                            let resultsArray = [];
                            for (let i = 0; i < results.length; i++) {
                                let dataObj = {
                                    "Name": results[i].Name,
                                    "ImageReference": results[i].ImageReference,
                                    "Images": results[i].Images,
                                };
                                self.apps.push(dataObj);
                            }
                        } catch (err) {
                            console.log(err);
                        }
                    },
                    getSpecificData: async function (_item) {
                        this.selectedAppData = [];
                        let results = await PrivacyPolicy_MUA.f.p.AJAXCalls.getSpecificData(_item.Name);
                        let resultsArray = [];
                        for (let i = 0; i < results.length; i++) {
                            let dataObj = {
                                "Name": results[i].Name,
                                "ImageReference": results[i].ImageReference,
                                "InformationCollected": results[i].InformationCollected,
                                "UsageOfInformation": results[i].UsageOfInformation,
                                "DisclosureOfInformation": results[i].DisclosureOfInformation,
                                "Rating": results[i].Rating,
                                "DataHeld": results[i].DataHeld,
                                "Images": results[i].Images,
                                "Age": results[i].Age,
                                "WebLink": results[i].WebLink,
                            };
                            this.selectedAppData.push(dataObj);
                        }
                        this.appDetails = true;
                    },
                    getDataBySearch: function () {
                        let self = this;
                        let filteredArray = [];
                        if (self.Search.Query.length > 0) {
                            for (let i = 0; i < self.apps.length; i++) {
                                if (self.apps[i].Name.toLowerCase().includes(self.Search.Query.toLowerCase())) {
                                    filteredArray.push(self.apps[i]);
                                }
                            }
                        }
                        self.filteredApps = filteredArray;
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
                    goBack: function () {
                        this.appDetails = false;
                    }
                },
                mounted() {
                    this.showDataList();
                },
                watch: {
                    'Search.Query': {
                        handler: function () {
                            this.getDataBySearch();
                        }
                    }
                }
            })
        })
    })
});