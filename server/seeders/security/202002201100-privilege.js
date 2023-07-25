'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert(
            {tableName: "Privilege", schema: "security"},
            [
                {
                    "id": 1,
                    "id_role": 1,
                    "id_module": 4,
                    "permit": "0",
                    "state": true,
                    "created_at": "2020-10-13T07:39:50.278Z",
                    "updated_at": "2020-10-13T07:39:50.278Z",
                    "deleted_at": null
                },
                {
                    "id": 2,
                    "id_role": 1,
                    "id_module": 4,
                    "permit": "1",
                    "state": true,
                    "created_at": "2020-10-13T07:39:50.803Z",
                    "updated_at": "2020-10-13T07:39:50.803Z",
                    "deleted_at": null
                },
                {
                    "id": 3,
                    "id_role": 1,
                    "id_module": 4,
                    "permit": "2",
                    "state": true,
                    "created_at": "2020-10-13T07:39:51.352Z",
                    "updated_at": "2020-10-13T07:39:51.352Z",
                    "deleted_at": null
                },
                {
                    "id": 4,
                    "id_role": 1,
                    "id_module": 4,
                    "permit": "3",
                    "state": true,
                    "created_at": "2020-10-13T07:39:52.040Z",
                    "updated_at": "2020-10-13T07:39:52.040Z",
                    "deleted_at": null
                },
                {
                    "id": 5,
                    "id_role": 1,
                    "id_module": 5,
                    "permit": "0",
                    "state": true,
                    "created_at": "2020-10-13T07:39:53.133Z",
                    "updated_at": "2020-10-13T07:39:53.133Z",
                    "deleted_at": null
                },
                {
                    "id": 6,
                    "id_role": 1,
                    "id_module": 5,
                    "permit": "1",
                    "state": true,
                    "created_at": "2020-10-13T07:39:53.932Z",
                    "updated_at": "2020-10-13T07:39:53.932Z",
                    "deleted_at": null
                },
                {
                    "id": 7,
                    "id_role": 1,
                    "id_module": 5,
                    "permit": "2",
                    "state": true,
                    "created_at": "2020-10-13T07:39:54.530Z",
                    "updated_at": "2020-10-13T07:39:54.530Z",
                    "deleted_at": null
                },
                {
                    "id": 8,
                    "id_role": 1,
                    "id_module": 5,
                    "permit": "3",
                    "state": true,
                    "created_at": "2020-10-13T07:39:55.121Z",
                    "updated_at": "2020-10-13T07:39:55.121Z",
                    "deleted_at": null
                },
                {
                    "id": 9,
                    "id_role": 1,
                    "id_module": 13,
                    "permit": "0",
                    "state": true,
                    "created_at": "2020-10-13T07:39:55.951Z",
                    "updated_at": "2020-10-13T07:39:55.951Z",
                    "deleted_at": null
                },
                {
                    "id": 10,
                    "id_role": 1,
                    "id_module": 13,
                    "permit": "1",
                    "state": true,
                    "created_at": "2020-10-13T07:39:56.478Z",
                    "updated_at": "2020-10-13T07:39:56.478Z",
                    "deleted_at": null
                },
                {
                    "id": 11,
                    "id_role": 1,
                    "id_module": 13,
                    "permit": "2",
                    "state": true,
                    "created_at": "2020-10-13T07:39:56.989Z",
                    "updated_at": "2020-10-13T07:39:56.989Z",
                    "deleted_at": null
                },
                {
                    "id": 12,
                    "id_role": 1,
                    "id_module": 13,
                    "permit": "3",
                    "state": true,
                    "created_at": "2020-10-13T07:39:57.696Z",
                    "updated_at": "2020-10-13T07:39:57.696Z",
                    "deleted_at": null
                },
                {
                    "id": 13,
                    "id_role": 1,
                    "id_module": 14,
                    "permit": "0",
                    "state": true,
                    "created_at": "2020-10-13T07:39:58.237Z",
                    "updated_at": "2020-10-13T07:39:58.237Z",
                    "deleted_at": null
                },
                {
                    "id": 14,
                    "id_role": 1,
                    "id_module": 14,
                    "permit": "1",
                    "state": true,
                    "created_at": "2020-10-13T07:39:58.715Z",
                    "updated_at": "2020-10-13T07:39:58.715Z",
                    "deleted_at": null
                },
                {
                    "id": 15,
                    "id_role": 1,
                    "id_module": 14,
                    "permit": "2",
                    "state": true,
                    "created_at": "2020-10-13T07:39:59.548Z",
                    "updated_at": "2020-10-13T07:39:59.548Z",
                    "deleted_at": null
                },
                {
                    "id": 16,
                    "id_role": 1,
                    "id_module": 14,
                    "permit": "3",
                    "state": true,
                    "created_at": "2020-10-13T07:40:00.212Z",
                    "updated_at": "2020-10-13T07:40:00.212Z",
                    "deleted_at": null
                },
                {
                    "id": 17,
                    "id_role": 1,
                    "id_module": 15,
                    "permit": "0",
                    "state": true,
                    "created_at": "2020-10-13T07:40:00.961Z",
                    "updated_at": "2020-10-13T07:40:00.961Z",
                    "deleted_at": null
                },
                {
                    "id": 18,
                    "id_role": 1,
                    "id_module": 15,
                    "permit": "1",
                    "state": true,
                    "created_at": "2020-10-13T07:40:01.470Z",
                    "updated_at": "2020-10-13T07:40:01.470Z",
                    "deleted_at": null
                },
                {
                    "id": 19,
                    "id_role": 1,
                    "id_module": 15,
                    "permit": "2",
                    "state": true,
                    "created_at": "2020-10-13T07:40:01.952Z",
                    "updated_at": "2020-10-13T07:40:01.952Z",
                    "deleted_at": null
                },
                {
                    "id": 20,
                    "id_role": 1,
                    "id_module": 15,
                    "permit": "3",
                    "state": true,
                    "created_at": "2020-10-13T07:40:02.460Z",
                    "updated_at": "2020-10-13T07:40:02.460Z",
                    "deleted_at": null
                },
                {
                    "id": 21,
                    "id_role": 1,
                    "id_module": 16,
                    "permit": "3",
                    "state": true,
                    "created_at": "2020-10-13T07:40:02.943Z",
                    "updated_at": "2020-10-13T07:40:02.943Z",
                    "deleted_at": null
                },
                {
                    "id": 22,
                    "id_role": 1,
                    "id_module": 16,
                    "permit": "2",
                    "state": true,
                    "created_at": "2020-10-13T07:40:03.472Z",
                    "updated_at": "2020-10-13T07:40:03.472Z",
                    "deleted_at": null
                },
                {
                    "id": 23,
                    "id_role": 1,
                    "id_module": 16,
                    "permit": "1",
                    "state": true,
                    "created_at": "2020-10-13T07:40:03.933Z",
                    "updated_at": "2020-10-13T07:40:03.933Z",
                    "deleted_at": null
                },
                {
                    "id": 24,
                    "id_role": 1,
                    "id_module": 16,
                    "permit": "0",
                    "state": true,
                    "created_at": "2020-10-13T07:40:04.405Z",
                    "updated_at": "2020-10-13T07:40:04.405Z",
                    "deleted_at": null
                },
                {
                    "id": 25,
                    "id_role": 1,
                    "id_module": 17,
                    "permit": "0",
                    "state": true,
                    "created_at": "2020-10-13T07:40:04.942Z",
                    "updated_at": "2020-10-13T07:40:04.942Z",
                    "deleted_at": null
                },
                {
                    "id": 26,
                    "id_role": 1,
                    "id_module": 17,
                    "permit": "1",
                    "state": true,
                    "created_at": "2020-10-13T07:40:05.430Z",
                    "updated_at": "2020-10-13T07:40:05.430Z",
                    "deleted_at": null
                },
                {
                    "id": 27,
                    "id_role": 1,
                    "id_module": 17,
                    "permit": "2",
                    "state": true,
                    "created_at": "2020-10-13T07:40:05.972Z",
                    "updated_at": "2020-10-13T07:40:05.972Z",
                    "deleted_at": null
                },
                {
                    "id": 28,
                    "id_role": 1,
                    "id_module": 17,
                    "permit": "3",
                    "state": true,
                    "created_at": "2020-10-13T07:40:06.509Z",
                    "updated_at": "2020-10-13T07:40:06.509Z",
                    "deleted_at": null
                },
                {
                    "id": 29,
                    "id_role": 1,
                    "id_module": 18,
                    "permit": "3",
                    "state": true,
                    "created_at": "2020-10-13T07:40:07.759Z",
                    "updated_at": "2020-10-13T07:40:07.759Z",
                    "deleted_at": null
                },
                {
                    "id": 30,
                    "id_role": 1,
                    "id_module": 18,
                    "permit": "2",
                    "state": true,
                    "created_at": "2020-10-13T07:40:08.279Z",
                    "updated_at": "2020-10-13T07:40:08.279Z",
                    "deleted_at": null
                },
                {
                    "id": 31,
                    "id_role": 1,
                    "id_module": 18,
                    "permit": "1",
                    "state": true,
                    "created_at": "2020-10-13T07:40:08.835Z",
                    "updated_at": "2020-10-13T07:40:08.835Z",
                    "deleted_at": null
                },
                {
                    "id": 32,
                    "id_role": 1,
                    "id_module": 18,
                    "permit": "0",
                    "state": true,
                    "created_at": "2020-10-13T07:40:09.318Z",
                    "updated_at": "2020-10-13T07:40:09.318Z",
                    "deleted_at": null
                },
                {
                    "id": 33,
                    "id_role": 1,
                    "id_module": 6,
                    "permit": "0",
                    "state": true,
                    "created_at": "2020-10-13T07:40:09.877Z",
                    "updated_at": "2020-10-13T07:40:09.877Z",
                    "deleted_at": null
                },
                {
                    "id": 34,
                    "id_role": 1,
                    "id_module": 6,
                    "permit": "1",
                    "state": true,
                    "created_at": "2020-10-13T07:40:10.490Z",
                    "updated_at": "2020-10-13T07:40:10.490Z",
                    "deleted_at": null
                },
                {
                    "id": 35,
                    "id_role": 1,
                    "id_module": 6,
                    "permit": "2",
                    "state": true,
                    "created_at": "2020-10-13T07:40:10.960Z",
                    "updated_at": "2020-10-13T07:40:10.960Z",
                    "deleted_at": null
                },
                {
                    "id": 36,
                    "id_role": 1,
                    "id_module": 6,
                    "permit": "3",
                    "state": true,
                    "created_at": "2020-10-13T07:40:11.460Z",
                    "updated_at": "2020-10-13T07:40:11.460Z",
                    "deleted_at": null
                },
                {
                    "id": 37,
                    "id_role": 1,
                    "id_module": 19,
                    "permit": "3",
                    "state": true,
                    "created_at": "2020-10-13T07:40:12.142Z",
                    "updated_at": "2020-10-13T07:40:12.142Z",
                    "deleted_at": null
                },
                {
                    "id": 38,
                    "id_role": 1,
                    "id_module": 19,
                    "permit": "2",
                    "state": true,
                    "created_at": "2020-10-13T07:40:12.768Z",
                    "updated_at": "2020-10-13T07:40:12.768Z",
                    "deleted_at": null
                },
                {
                    "id": 39,
                    "id_role": 1,
                    "id_module": 19,
                    "permit": "1",
                    "state": true,
                    "created_at": "2020-10-13T07:40:13.243Z",
                    "updated_at": "2020-10-13T07:40:13.243Z",
                    "deleted_at": null
                },
                {
                    "id": 40,
                    "id_role": 1,
                    "id_module": 19,
                    "permit": "0",
                    "state": true,
                    "created_at": "2020-10-13T07:40:13.667Z",
                    "updated_at": "2020-10-13T07:40:13.667Z",
                    "deleted_at": null
                },
                {
                    "id": 41,
                    "id_role": 1,
                    "id_module": 20,
                    "permit": "0",
                    "state": true,
                    "created_at": "2020-10-13T07:40:14.166Z",
                    "updated_at": "2020-10-13T07:40:14.166Z",
                    "deleted_at": null
                },
                {
                    "id": 42,
                    "id_role": 1,
                    "id_module": 20,
                    "permit": "1",
                    "state": true,
                    "created_at": "2020-10-13T07:40:14.702Z",
                    "updated_at": "2020-10-13T07:40:14.702Z",
                    "deleted_at": null
                },
                {
                    "id": 43,
                    "id_role": 1,
                    "id_module": 20,
                    "permit": "2",
                    "state": true,
                    "created_at": "2020-10-13T07:40:15.218Z",
                    "updated_at": "2020-10-13T07:40:15.218Z",
                    "deleted_at": null
                },
                {
                    "id": 44,
                    "id_role": 1,
                    "id_module": 20,
                    "permit": "3",
                    "state": true,
                    "created_at": "2020-10-13T07:40:15.636Z",
                    "updated_at": "2020-10-13T07:40:15.636Z",
                    "deleted_at": null
                },
                {
                    "id": 45,
                    "id_role": 1,
                    "id_module": 21,
                    "permit": "0",
                    "state": true,
                    "created_at": "2020-10-13T07:40:16.428Z",
                    "updated_at": "2020-10-13T07:40:16.428Z",
                    "deleted_at": null
                },
                {
                    "id": 46,
                    "id_role": 1,
                    "id_module": 21,
                    "permit": "1",
                    "state": true,
                    "created_at": "2020-10-13T07:40:16.807Z",
                    "updated_at": "2020-10-13T07:40:16.807Z",
                    "deleted_at": null
                },
                {
                    "id": 47,
                    "id_role": 1,
                    "id_module": 21,
                    "permit": "2",
                    "state": true,
                    "created_at": "2020-10-13T07:40:17.205Z",
                    "updated_at": "2020-10-13T07:40:17.205Z",
                    "deleted_at": null
                },
                {
                    "id": 48,
                    "id_role": 1,
                    "id_module": 21,
                    "permit": "3",
                    "state": true,
                    "created_at": "2020-10-13T07:40:17.644Z",
                    "updated_at": "2020-10-13T07:40:17.644Z",
                    "deleted_at": null
                },
                {
                    "id": 52,
                    "id_role": 1,
                    "id_module": 7,
                    "permit": "3",
                    "state": true,
                    "created_at": "2020-10-13T07:40:22.204Z",
                    "updated_at": "2020-10-13T07:40:22.204Z",
                    "deleted_at": null
                },
                {
                    "id": 51,
                    "id_role": 1,
                    "id_module": 7,
                    "permit": "2",
                    "state": false,
                    "created_at": "2020-10-13T07:40:20.072Z",
                    "updated_at": "2020-10-13T07:40:22.739Z",
                    "deleted_at": null
                },
                {
                    "id": 50,
                    "id_role": 1,
                    "id_module": 7,
                    "permit": "1",
                    "state": false,
                    "created_at": "2020-10-13T07:40:19.750Z",
                    "updated_at": "2020-10-13T07:40:23.295Z",
                    "deleted_at": null
                },
                {
                    "id": 49,
                    "id_role": 1,
                    "id_module": 7,
                    "permit": "0",
                    "state": false,
                    "created_at": "2020-10-13T07:40:18.968Z",
                    "updated_at": "2020-10-13T07:40:23.784Z",
                    "deleted_at": null
                },
                {
                    "id": 53,
                    "id_role": 1,
                    "id_module": 22,
                    "permit": "0",
                    "state": true,
                    "created_at": "2020-10-13T07:40:24.691Z",
                    "updated_at": "2020-10-13T07:40:24.691Z",
                    "deleted_at": null
                },
                {
                    "id": 54,
                    "id_role": 1,
                    "id_module": 22,
                    "permit": "2",
                    "state": true,
                    "created_at": "2020-10-13T07:40:25.748Z",
                    "updated_at": "2020-10-13T07:40:25.748Z",
                    "deleted_at": null
                },
                {
                    "id": 55,
                    "id_role": 1,
                    "id_module": 22,
                    "permit": "1",
                    "state": true,
                    "created_at": "2020-10-13T07:40:26.313Z",
                    "updated_at": "2020-10-13T07:40:26.313Z",
                    "deleted_at": null
                },
                {
                    "id": 56,
                    "id_role": 1,
                    "id_module": 22,
                    "permit": "3",
                    "state": true,
                    "created_at": "2020-10-13T07:40:26.979Z",
                    "updated_at": "2020-10-13T07:40:26.979Z",
                    "deleted_at": null
                },
                {
                    "id": 57,
                    "id_role": 1,
                    "id_module": 23,
                    "permit": "3",
                    "state": true,
                    "created_at": "2020-10-13T07:40:27.428Z",
                    "updated_at": "2020-10-13T07:40:27.428Z",
                    "deleted_at": null
                },
                {
                    "id": 58,
                    "id_role": 1,
                    "id_module": 23,
                    "permit": "2",
                    "state": true,
                    "created_at": "2020-10-13T07:40:27.935Z",
                    "updated_at": "2020-10-13T07:40:27.935Z",
                    "deleted_at": null
                },
                {
                    "id": 59,
                    "id_role": 1,
                    "id_module": 23,
                    "permit": "1",
                    "state": true,
                    "created_at": "2020-10-13T07:40:29.234Z",
                    "updated_at": "2020-10-13T07:40:29.234Z",
                    "deleted_at": null
                },
                {
                    "id": 60,
                    "id_role": 1,
                    "id_module": 23,
                    "permit": "0",
                    "state": true,
                    "created_at": "2020-10-13T07:40:29.683Z",
                    "updated_at": "2020-10-13T07:40:29.683Z",
                    "deleted_at": null
                },
                {
                    "id": 61,
                    "id_role": 1,
                    "id_module": 8,
                    "permit": "3",
                    "state": true,
                    "created_at": "2020-10-13T07:40:30.419Z",
                    "updated_at": "2020-10-13T07:40:30.419Z",
                    "deleted_at": null
                },
                {
                    "id": 62,
                    "id_role": 1,
                    "id_module": 24,
                    "permit": "3",
                    "state": true,
                    "created_at": "2020-10-13T07:40:31.045Z",
                    "updated_at": "2020-10-13T07:40:31.045Z",
                    "deleted_at": null
                },
                {
                    "id": 63,
                    "id_role": 1,
                    "id_module": 24,
                    "permit": "2",
                    "state": true,
                    "created_at": "2020-10-13T07:40:31.461Z",
                    "updated_at": "2020-10-13T07:40:31.461Z",
                    "deleted_at": null
                },
                {
                    "id": 64,
                    "id_role": 1,
                    "id_module": 24,
                    "permit": "1",
                    "state": true,
                    "created_at": "2020-10-13T07:40:32.013Z",
                    "updated_at": "2020-10-13T07:40:32.013Z",
                    "deleted_at": null
                },
                {
                    "id": 65,
                    "id_role": 1,
                    "id_module": 24,
                    "permit": "0",
                    "state": true,
                    "created_at": "2020-10-13T07:40:32.494Z",
                    "updated_at": "2020-10-13T07:40:32.494Z",
                    "deleted_at": null
                },
                {
                    "id": 66,
                    "id_role": 1,
                    "id_module": 25,
                    "permit": "0",
                    "state": true,
                    "created_at": "2020-10-13T07:40:33.703Z",
                    "updated_at": "2020-10-13T07:40:33.703Z",
                    "deleted_at": null
                },
                {
                    "id": 67,
                    "id_role": 1,
                    "id_module": 25,
                    "permit": "2",
                    "state": true,
                    "created_at": "2020-10-13T07:40:34.171Z",
                    "updated_at": "2020-10-13T07:40:34.171Z",
                    "deleted_at": null
                },
                {
                    "id": 68,
                    "id_role": 1,
                    "id_module": 25,
                    "permit": "1",
                    "state": true,
                    "created_at": "2020-10-13T07:40:34.831Z",
                    "updated_at": "2020-10-13T07:40:34.831Z",
                    "deleted_at": null
                },
                {
                    "id": 69,
                    "id_role": 1,
                    "id_module": 25,
                    "permit": "3",
                    "state": true,
                    "created_at": "2020-10-13T07:40:35.325Z",
                    "updated_at": "2020-10-13T07:40:35.325Z",
                    "deleted_at": null
                },
                {
                    "id": 70,
                    "id_role": 1,
                    "id_module": 26,
                    "permit": "3",
                    "state": true,
                    "created_at": "2020-10-13T07:40:35.896Z",
                    "updated_at": "2020-10-13T07:40:35.896Z",
                    "deleted_at": null
                },
                {
                    "id": 71,
                    "id_role": 1,
                    "id_module": 26,
                    "permit": "2",
                    "state": true,
                    "created_at": "2020-10-13T07:40:36.339Z",
                    "updated_at": "2020-10-13T07:40:36.339Z",
                    "deleted_at": null
                },
                {
                    "id": 72,
                    "id_role": 1,
                    "id_module": 26,
                    "permit": "1",
                    "state": true,
                    "created_at": "2020-10-13T07:40:36.832Z",
                    "updated_at": "2020-10-13T07:40:36.832Z",
                    "deleted_at": null
                },
                {
                    "id": 73,
                    "id_role": 1,
                    "id_module": 26,
                    "permit": "0",
                    "state": true,
                    "created_at": "2020-10-13T07:40:37.284Z",
                    "updated_at": "2020-10-13T07:40:37.284Z",
                    "deleted_at": null
                },
                {
                    "id": 74,
                    "id_role": 1,
                    "id_module": 9,
                    "permit": "0",
                    "state": true,
                    "created_at": "2020-10-13T07:40:37.980Z",
                    "updated_at": "2020-10-13T07:40:37.980Z",
                    "deleted_at": null
                },
                {
                    "id": 75,
                    "id_role": 1,
                    "id_module": 9,
                    "permit": "1",
                    "state": true,
                    "created_at": "2020-10-13T07:40:38.363Z",
                    "updated_at": "2020-10-13T07:40:38.363Z",
                    "deleted_at": null
                },
                {
                    "id": 76,
                    "id_role": 1,
                    "id_module": 9,
                    "permit": "2",
                    "state": true,
                    "created_at": "2020-10-13T07:40:39.045Z",
                    "updated_at": "2020-10-13T07:40:39.045Z",
                    "deleted_at": null
                },
                {
                    "id": 77,
                    "id_role": 1,
                    "id_module": 9,
                    "permit": "3",
                    "state": true,
                    "created_at": "2020-10-13T07:40:39.635Z",
                    "updated_at": "2020-10-13T07:40:39.635Z",
                    "deleted_at": null
                },
                {
                    "id": 78,
                    "id_role": 1,
                    "id_module": 11,
                    "permit": "0",
                    "state": true,
                    "created_at": "2020-10-13T07:40:42.048Z",
                    "updated_at": "2020-10-13T07:40:42.048Z",
                    "deleted_at": null
                },
                {
                    "id": 79,
                    "id_role": 1,
                    "id_module": 11,
                    "permit": "1",
                    "state": true,
                    "created_at": "2020-10-13T07:40:42.465Z",
                    "updated_at": "2020-10-13T07:40:42.465Z",
                    "deleted_at": null
                },
                {
                    "id": 80,
                    "id_role": 1,
                    "id_module": 11,
                    "permit": "2",
                    "state": true,
                    "created_at": "2020-10-13T07:40:42.968Z",
                    "updated_at": "2020-10-13T07:40:42.968Z",
                    "deleted_at": null
                },
                {
                    "id": 81,
                    "id_role": 1,
                    "id_module": 11,
                    "permit": "3",
                    "state": true,
                    "created_at": "2020-10-13T07:40:43.476Z",
                    "updated_at": "2020-10-13T07:40:43.476Z",
                    "deleted_at": null
                }
            ]
        )


    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete({tableName: 'Privilege', schema: 'security'}, null, {});
    },


};
