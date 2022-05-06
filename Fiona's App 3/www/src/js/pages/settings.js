// Routed component through main JS OOP file
PrivacyPolicy_MUA.f.p.Settings = Vue.component('Settings', function (resolve, reject) {
    // Gets the HTML to inject into the router view
    fetch("./src/html/pages/settings.html").then(function (data) {
        // Loads the data to manipulate
        data.text().then(function (html) {
            // Data
            resolve({
                // Name of the page, mainly semantic reasons for the purpose of this app
                name: "Settings",
                // Loads the HTML
                template: html,
                // Reactive data that interacts with the HTML
                data() {
                    return {
                        fontSize: null,
                    }
                },
                // Highly reactive methods that are triggered on Vue Data variable changes (from data() {} above)
                computed: {

                },
                // This is where the normal functions go, in OOP format, of course.
                methods: {
                    toggleDarkTheme: function () {
                        let body = document.body;
                        let isDarkThemeActive = false;
                        for (let i = 0; i < body.classList.length; i++) {
                            if (body.classList[i].includes('theme-dark')) {
                                isDarkThemeActive = true;
                            }
                        }
                        if (isDarkThemeActive) {
                            body.classList.remove("theme-dark");
                        } else {
                            body.classList.add("theme-dark");
                        }
                    },
                    decreaseFontSize: function () {
                        let self = this;
                        document.getElementsByTagName("body")[0].style = "font-size:" + (JSON.parse(self.fontSize.replace(/[^0-9]/g, '')) - 1) + "px";
                        self.fontSize = document.getElementsByTagName("body")[0].style.fontSize;
                    },
                    increaseFontSize: function () {
                        let self = this;
                        document.getElementsByTagName("body")[0].style = "font-size:" + (JSON.parse(self.fontSize.replace(/[^0-9]/g, '')) + 1) + "px";
                        self.fontSize = document.getElementsByTagName("body")[0].style.fontSize;
                    }
                },
                // Function that runs when the html and js of a page has laoded in. 
                mounted() {
                    let self = this;
                    self.fontSize = document.getElementsByTagName("body")[0].style.fontSize;
                }
            })
        })
    })
});