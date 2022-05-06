PrivacyPolicy_MUA.f.p.Comparison = Vue.component('Comparison', function (resolve, reject) {
    fetch("./src/html/pages/comparison.html").then(function (data) {
        data.text().then(function (html) {
            resolve({
                name: "Comparison",
                template: html,
                data() {
                    return {
                        Search: {
                            Query: null,
                            Result: [],
                        },
                        apps: [],
                        comparisonArray: [],
                        Options: [{
                            "Name": "Geolocation Tracking",
                        }, {
                            "Name": "User Data Collection",
                        }, {
                            "Name": "Device Information Stored",
                        }, {
                            "Name": "Shares Data With 3rd Parties",
                        }, {
                            "Name": "Data Held For <5 Years",
                        }],
                        selectedOption: null,
                        displayComparison: [],
                        showComparisonPage: false,
                    }
                },
                computed: {

                },
                methods: {
                    showDataList: async function () {
                        let results = await PrivacyPolicy_MUA.f.p.AJAXCalls.getAllData();
                        let resultsArray = [];
                        for (let i = 0; i < results.length; i++) {
                            let specificResults = await PrivacyPolicy_MUA.f.p.AJAXCalls.getSpecificData(results[i].Name);
                            let dataObj = {
                                "Name": specificResults[0].Name,
                                "ImageReference": specificResults[0].ImageReference,
                                "InformationCollected": specificResults[0].InformationCollected,
                                "UsageOfInformation": specificResults[0].UsageOfInformation,
                                "DisclosureOfInformation": specificResults[0].DisclosureOfInformation,
                                "Age": specificResults[0].Age,
                                "DataHeld": specificResults[0].DataHeld,
                                "WebLink": specificResults[0].WebLink,
                                "Rating": specificResults[0].Rating,
                            }
                            this.apps.push(dataObj);
                        }
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
                        self.Search.Result = filteredArray;
                    },
                    selectUnselectItemForComparison: function (_item) {
                        let self = this;
                        let isInComparisonArray = false;
                        if (self.comparisonArray.length == 7) {
                            for (let i = 0; i < self.comparisonArray.length; i++) {
                                if (self.comparisonArray[i].Name == _item.Name) {
                                    isInComparisonArray = true;
                                }
                            }
                            if (isInComparisonArray) {
                                for (let i = 0; i < self.comparisonArray.length; i++) {
                                    if (self.comparisonArray[i].Name == _item.Name) {
                                        self.comparisonArray.splice(i, 1);
                                    }
                                }
                            }
                        } else {
                            for (let i = 0; i < self.comparisonArray.length; i++) {
                                if (self.comparisonArray[i].Name == _item.Name) {
                                    isInComparisonArray = true;
                                }
                            }
                            if (isInComparisonArray) {
                                for (let i = 0; i < self.comparisonArray.length; i++) {
                                    if (self.comparisonArray[i].Name == _item.Name) {
                                        self.comparisonArray.splice(i, 1);
                                    }
                                }
                            } else {
                                this.comparisonArray.push(_item);
                            }
                        }
                    },
                    isItemChecked: function (_item) {
                        let self = this;
                        let isChecked = false;
                        for (let i = 0; i < self.comparisonArray.length; i++) {
                            if (self.comparisonArray[i].Name == _item.Name) {
                                isChecked = true;
                            }
                        }
                        if (isChecked) {
                            return true;
                        } else {
                            return false;
                        }

                    },
                    selectUnselectOptionForComparison: function (_option) {
                        let self = this;
                        self.selectedOption = _option;
                    },
                    isOptionChecked: function (_option) {
                        let self = this;
                        if (self.Options[0].Name == _option.Name) {
                            return true;
                        } else {
                            return false;
                        }
                    },
                    compare: function () {
                        let self = this;
                        switch (self.selectedOption.Name) {
                            case "Geolocation Tracking":
                                self.compareGeolocationTracking();
                                break;
                            case "User Data Collection":
                                self.compareUserDataCollection();
                                break;
                            case "Device Information Stored":
                                self.compareDeviceInformationStored();
                                break;
                            case "Shares Data With 3rd Parties":
                                self.compareSharesDataWithThirdParties();
                                break;
                            case "Data Held For <5 Years":
                                self.compareDataHeldForLessThanFiveYears();
                                break;
                            default:
                        }
                    },
                    compareGeolocationTracking: function () {
                        let self = this;
                        self.displayComparison = [];
                        let redArray = [];
                        let redArraySorted = null;
                        let greenArray = [];
                        let greenArraySorted = null;
                        let concatArray = [];
                        for (let i = 0; i < self.comparisonArray.length; i++) {
                            let string = self.comparisonArray[i].InformationCollected;
                            if (string.includes('Geolocation') || string.includes('Location') || string.includes('No information provided')) {
                                let dataObj = {
                                    "Name": self.comparisonArray[i].Name,
                                    "ImageReference": self.comparisonArray[i].ImageReference,
                                    "InformationCollected": self.comparisonArray[i].InformationCollected,
                                    "UsageOfInformation": self.comparisonArray[i].UsageOfInformation,
                                    "DisclosureOfInformation": self.comparisonArray[i].DisclosureOfInformation,
                                    "Age": self.comparisonArray[i].Age,
                                    "WebLink": self.comparisonArray[i].WebLink,
                                    "Rating": self.comparisonArray[i].Rating,
                                    "isRed": true,
                                }
                                redArray.push(dataObj);
                            } else {
                                let dataObj = {
                                    "Name": self.comparisonArray[i].Name,
                                    "ImageReference": self.comparisonArray[i].ImageReference,
                                    "InformationCollected": self.comparisonArray[i].InformationCollected,
                                    "UsageOfInformation": self.comparisonArray[i].UsageOfInformation,
                                    "DisclosureOfInformation": self.comparisonArray[i].DisclosureOfInformation,
                                    "Age": self.comparisonArray[i].Age,
                                    "WebLink": self.comparisonArray[i].WebLink,
                                    "Rating": self.comparisonArray[i].Rating,
                                    "isRed": false,
                                }
                                greenArray.push(dataObj);
                            }
                        }
                        redArraySorted = _.sortBy(redArray, 'Rating').reverse();
                        greenArraySorted = _.sortBy(greenArray, 'Rating').reverse();
                        concatArray = greenArraySorted.concat(redArraySorted);
                        self.displayComparison = concatArray;
                        self.showComparisonPage = true;
                    },
                    compareUserDataCollection: function () {
                        let self = this;
                        self.displayComparison = [];
                        let redArray = [];
                        let redArraySorted = null;
                        let greenArray = [];
                        let greenArraySorted = null;
                        let concatArray = [];
                        for (let i = 0; i < self.comparisonArray.length; i++) {
                            let string = self.comparisonArray[i].InformationCollected;
                            if (string.includes('Cookies') || string.includes('Usage') || string.includes('Usage Information') || string.includes('No information provided')) {
                                let dataObj = {
                                    "Name": self.comparisonArray[i].Name,
                                    "ImageReference": self.comparisonArray[i].ImageReference,
                                    "InformationCollected": self.comparisonArray[i].InformationCollected,
                                    "UsageOfInformation": self.comparisonArray[i].UsageOfInformation,
                                    "DisclosureOfInformation": self.comparisonArray[i].DisclosureOfInformation,
                                    "Age": self.comparisonArray[i].Age,
                                    "WebLink": self.comparisonArray[i].WebLink,
                                    "Rating": self.comparisonArray[i].Rating,
                                    "isRed": true,
                                }
                                redArray.push(dataObj);
                            } else {
                                let dataObj = {
                                    "Name": self.comparisonArray[i].Name,
                                    "ImageReference": self.comparisonArray[i].ImageReference,
                                    "InformationCollected": self.comparisonArray[i].InformationCollected,
                                    "UsageOfInformation": self.comparisonArray[i].UsageOfInformation,
                                    "DisclosureOfInformation": self.comparisonArray[i].DisclosureOfInformation,
                                    "Age": self.comparisonArray[i].Age,
                                    "WebLink": self.comparisonArray[i].WebLink,
                                    "Rating": self.comparisonArray[i].Rating,
                                    "isRed": false,
                                }
                                greenArray.push(dataObj);
                            }
                        }
                        redArraySorted = _.sortBy(redArray, 'Rating').reverse();
                        greenArraySorted = _.sortBy(greenArray, 'Rating').reverse();
                        concatArray = greenArraySorted.concat(redArraySorted);
                        self.displayComparison = concatArray;
                        self.showComparisonPage = true;
                    },
                    compareDeviceInformationStored: function () {
                        let self = this;
                        self.displayComparison = [];
                        let redArray = [];
                        let redArraySorted = null;
                        let greenArray = [];
                        let greenArraySorted = null;
                        let concatArray = [];
                        for (let i = 0; i < self.comparisonArray.length; i++) {
                            let string = self.comparisonArray[i].InformationCollected;
                            if (string.includes('Device Information') || string.includes('No information provided')) {
                                let dataObj = {
                                    "Name": self.comparisonArray[i].Name,
                                    "ImageReference": self.comparisonArray[i].ImageReference,
                                    "InformationCollected": self.comparisonArray[i].InformationCollected,
                                    "UsageOfInformation": self.comparisonArray[i].UsageOfInformation,
                                    "DisclosureOfInformation": self.comparisonArray[i].DisclosureOfInformation,
                                    "Age": self.comparisonArray[i].Age,
                                    "WebLink": self.comparisonArray[i].WebLink,
                                    "Rating": self.comparisonArray[i].Rating,
                                    "isRed": true,
                                }
                                redArray.push(dataObj);
                            } else {
                                let dataObj = {
                                    "Name": self.comparisonArray[i].Name,
                                    "ImageReference": self.comparisonArray[i].ImageReference,
                                    "InformationCollected": self.comparisonArray[i].InformationCollected,
                                    "UsageOfInformation": self.comparisonArray[i].UsageOfInformation,
                                    "DisclosureOfInformation": self.comparisonArray[i].DisclosureOfInformation,
                                    "Age": self.comparisonArray[i].Age,
                                    "WebLink": self.comparisonArray[i].WebLink,
                                    "Rating": self.comparisonArray[i].Rating,
                                    "isRed": false,
                                }
                                greenArray.push(dataObj);
                            }
                        }
                        redArraySorted = _.sortBy(redArray, 'Rating').reverse();
                        greenArraySorted = _.sortBy(greenArray, 'Rating').reverse();
                        concatArray = greenArraySorted.concat(redArraySorted);
                        self.displayComparison = concatArray;
                        self.showComparisonPage = true;
                    },
                    compareSharesDataWithThirdParties: function () {
                        let self = this;
                        self.displayComparison = [];
                        let redArray = [];
                        let redArraySorted = null;
                        let greenArray = [];
                        let greenArraySorted = null;
                        let concatArray = [];
                        for (let i = 0; i < self.comparisonArray.length; i++) {
                            let string = self.comparisonArray[i].DisclosureOfInformation;
                            if (string.includes('Third Parties') || string.includes('Advertisers') || string.includes('No information provided')) {
                                let dataObj = {
                                    "Name": self.comparisonArray[i].Name,
                                    "ImageReference": self.comparisonArray[i].ImageReference,
                                    "InformationCollected": self.comparisonArray[i].InformationCollected,
                                    "UsageOfInformation": self.comparisonArray[i].UsageOfInformation,
                                    "DisclosureOfInformation": self.comparisonArray[i].DisclosureOfInformation,
                                    "Age": self.comparisonArray[i].Age,
                                    "WebLink": self.comparisonArray[i].WebLink,
                                    "Rating": self.comparisonArray[i].Rating,
                                    "isRed": true,
                                }
                                redArray.push(dataObj);
                            } else {
                                let dataObj = {
                                    "Name": self.comparisonArray[i].Name,
                                    "ImageReference": self.comparisonArray[i].ImageReference,
                                    "InformationCollected": self.comparisonArray[i].InformationCollected,
                                    "UsageOfInformation": self.comparisonArray[i].UsageOfInformation,
                                    "DisclosureOfInformation": self.comparisonArray[i].DisclosureOfInformation,
                                    "Age": self.comparisonArray[i].Age,
                                    "WebLink": self.comparisonArray[i].WebLink,
                                    "Rating": self.comparisonArray[i].Rating,
                                    "isRed": false,
                                }
                                greenArray.push(dataObj);
                            }
                        }
                        redArraySorted = _.sortBy(redArray, 'Rating').reverse();
                        greenArraySorted = _.sortBy(greenArray, 'Rating').reverse();
                        concatArray = greenArraySorted.concat(redArraySorted);
                        self.displayComparison = concatArray;
                        self.showComparisonPage = true;
                    },
                    compareDataHeldForLessThanFiveYears: function () {
                        let self = this;
                        self.displayComparison = [];
                        let redArray = [];
                        let redArraySorted = null;
                        let greenArray = [];
                        let greenArraySorted = null;
                        let concatArray = [];
                        for (let i = 0; i < self.comparisonArray.length; i++) {
                            let string = self.comparisonArray[i].DataHeld;
                            if (string.includes('years')) {
                                let yearsArray = string.replace(/[^0-9]/g, '');
                                if (yearsArray > 5) {
                                    let dataObj = {
                                        "Name": self.comparisonArray[i].Name,
                                        "ImageReference": self.comparisonArray[i].ImageReference,
                                        "InformationCollected": self.comparisonArray[i].InformationCollected,
                                        "UsageOfInformation": self.comparisonArray[i].UsageOfInformation,
                                        "DisclosureOfInformation": self.comparisonArray[i].DisclosureOfInformation,
                                        "Age": self.comparisonArray[i].Age,
                                        "DataHeld": self.comparisonArray[i].DataHeld,
                                        "WebLink": self.comparisonArray[i].WebLink,
                                        "Rating": self.comparisonArray[i].Rating,
                                        "isRed": true,
                                    }
                                    redArray.push(dataObj);
                                } else {
                                    let dataObj = {
                                        "Name": self.comparisonArray[i].Name,
                                        "ImageReference": self.comparisonArray[i].ImageReference,
                                        "InformationCollected": self.comparisonArray[i].InformationCollected,
                                        "UsageOfInformation": self.comparisonArray[i].UsageOfInformation,
                                        "DisclosureOfInformation": self.comparisonArray[i].DisclosureOfInformation,
                                        "Age": self.comparisonArray[i].Age,
                                        "DataHeld": self.comparisonArray[i].DataHeld,
                                        "WebLink": self.comparisonArray[i].WebLink,
                                        "Rating": self.comparisonArray[i].Rating,
                                        "isRed": false,
                                    }
                                    greenArray.push(dataObj);
                                }
                            } else if (string.includes('Indefinitely') || string.includes('No information provided')) {
                                let dataObj = {
                                    "Name": self.comparisonArray[i].Name,
                                    "ImageReference": self.comparisonArray[i].ImageReference,
                                    "InformationCollected": self.comparisonArray[i].InformationCollected,
                                    "UsageOfInformation": self.comparisonArray[i].UsageOfInformation,
                                    "DisclosureOfInformation": self.comparisonArray[i].DisclosureOfInformation,
                                    "Age": self.comparisonArray[i].Age,
                                    "DataHeld": self.comparisonArray[i].DataHeld,
                                    "WebLink": self.comparisonArray[i].WebLink,
                                    "Rating": self.comparisonArray[i].Rating,
                                    "isRed": true,
                                }
                                redArray.push(dataObj);
                            } else {
                                let dataObj = {
                                    "Name": self.comparisonArray[i].Name,
                                    "ImageReference": self.comparisonArray[i].ImageReference,
                                    "InformationCollected": self.comparisonArray[i].InformationCollected,
                                    "UsageOfInformation": self.comparisonArray[i].UsageOfInformation,
                                    "DisclosureOfInformation": self.comparisonArray[i].DisclosureOfInformation,
                                    "Age": self.comparisonArray[i].Age,
                                    "DataHeld": self.comparisonArray[i].DataHeld,
                                    "WebLink": self.comparisonArray[i].WebLink,
                                    "Rating": self.comparisonArray[i].Rating,
                                    "isRed": false,
                                }
                                greenArray.push(dataObj);
                            }
                        }
                        redArraySorted = _.sortBy(redArray, 'Rating').reverse();
                        greenArraySorted = _.sortBy(greenArray, 'Rating').reverse();
                        concatArray = greenArraySorted.concat(redArraySorted);
                        self.displayComparison = concatArray;
                        self.showComparisonPage = true;
                    },
                    goBack: function () {
                        this.showComparisonPage = false;
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