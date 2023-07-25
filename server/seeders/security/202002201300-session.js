module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            {tableName: "Session", schema: "security"},
            [
                {
                    "id": 1,
                    "id_user": "5daa0884-be54-4359-9d93-af326967822c",
                    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTg0NjM1NTcsImV4cCI6MTU5ODU0OTk1N30.KEZpbXD_A8gGo4xAGFJXEGxpxQaKoPqQ_YoEad-YMqQ",
                    "device_name": "DESKTOP-U9OQ33J",
                    "ip": "::ffff:127.0.0.1",
                    "mac": "00:00:00:00:00:00",
                    "device_type": "{\"desktop\":true,\"mobile\":false,\"tablet\":false}",
                    "browser": "{\"name\":\"Chrome\",\"version\":\"84\",\"fullVersion\":\"84.0.4147.135\",\"os\":\"Windows\"}",
                    "logueado": false,
                    "state": "En línea",
                    "created_at": "2020-05-31T10:30:54.198Z",
                    "updated_at": "2020-05-31T10:30:54.198Z",
                    "deleted_at": null
                },
                // {
                //     "id": 2,
                //     "id_user": "8f37f17b-06e8-4ffd-be0b-bde2eac30186",
                //     "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1OTg0NjQ5OTMsImV4cCI6MTU5ODU1MTM5M30.xc_IvQLGZUeQWvn-OiB3PIgPFIwhNZg6XNCy_dgJ4rM",
                //     "device_name": "DESKTOP-U9OQ33J",
                //     "ip": "::ffff:127.0.0.1",
                //     "mac": "00:00:00:00:00:00",
                //     "device_type": "{\"desktop\":true,\"mobile\":false,\"tablet\":false}",
                //     "browser": "{\"name\":\"Chrome\",\"version\":\"84\",\"fullVersion\":\"84.0.4147.135\",\"os\":\"Windows\"}",
                //     "logueado": true,
                //     "state": "En línea",
                //     "created_at": "2020-05-31T10:30:54.198Z",
                //     "updated_at": "2020-05-31T10:30:54.198Z",
                //     "deleted_at": null
                // }
            ]
        )


    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete({tableName: 'Session', schema: 'security'}, null, {});
    },


};
