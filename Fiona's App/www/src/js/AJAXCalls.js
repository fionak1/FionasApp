PrivacyPolicy_MUA.f.p.AJAXCalls = {
    getAllData: function () {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "http://18.134.226.137:80/src/php/getDataList.php",
                type: "POST",
                dataType: "json",
                data: {},
                success: function (data) {
                    resolve(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });
    },
    getSpecificData: function (_name) {
        return new Promise((resolve, reject) => {
            $.ajax({
                url: "http://18.134.226.137:80/src/php/getSpecificData.php",
                type: "POST",
                dataType: "json",
                data: {
                    "Name": _name
                },
                success: function (data) {
                    resolve(data);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    reject(textStatus);
                }
            });
        });
    },
}