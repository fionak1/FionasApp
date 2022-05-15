PrivacyPolicy_MUA.f.p.HomePage = Vue.component('HomePage', function (resolve, reject) {
    fetch("./src/html/pages/homePage.html").then(function (data) {
        data.text().then(function (html) {
            resolve({
                name: "HomePage",
                template: html,
                data() {
                    return {

                    }
                },
                computed: {

                },
                methods: {

                },
                mounted() {

                }
            })
        })
    })
});