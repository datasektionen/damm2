/*
	Adapter that gather data from dfunkt.datasektionen.se. Specifically it gathers information about elections.
	Written by Jonas Dahl.
*/
import moment from 'moment';
import axios, { AxiosResponse } from 'axios';
import { User } from '../../common/types';

export interface IRole {
	id: number;
	title: string;
	description: string;
	identifier: string;
	email: string;
	active: boolean;
}

interface IMandatesForRole {
	role: IRole;
	mandates: { start: string; end: string; User: User }[]
}

const fetchMandatesForRole = async (role: IRole): Promise<{ date: moment.Moment; role: IRole; user: User; }[]> => {
	return axios.get(`https://dfunkt.datasektionen.se/api/role/${encodeURIComponent(role.identifier)}`)
		.catch(() => console.log('Couldn\'t fetch dfunkt mandates for role ' + role.identifier))
		.then((response: void | AxiosResponse<any>) => (response as AxiosResponse<any>).data)
		.then((r: IMandatesForRole) => r.mandates.map(mandate => ({
			date: moment(mandate.start),
			role: role,
			user: mandate.User,
		})));
	// return fetch('https://dfunkt.datasektionen.se/api/role/' + role.identifier)
	// 	.catch(x => console.log('Couldn\'t fetch dfunkt mandates for role ' + role.identifier))
	// 	.then(res => res.json())
	// 	.catch(x => console.log('Couldn\'t parse dfunkt mandates list for role ' + role.identifier))
	// .then(r => r.mandates.map(mandate => ({
	// 		date: moment(mandate.start),
	// 		role: role,
	// 		user: mandate.User
	// })))
};

export const dfunkt: () => Promise<{ date: moment.Moment; template: "DFUNKT"; mandates: any }[]> = () => {
	return new Promise((resolve) => {
		let events = [] as any[];

		// First, we need to fetch all roles, to then be able to fetch their mandates
		// At the moment, dfunkt does not support fetching it all in one request
		axios.get("https://dfunkt.datasektionen.se/api/roles")
			.catch(() => console.log('Couldn\'t fetch dfunkt roles list'))
			.then((response: void | AxiosResponse<any>) => (response as AxiosResponse<any>).data)
			.then((roles: IRole[]) => {
				const promises = [] as any[];

				roles.forEach(role => promises.push(fetchMandatesForRole(role)));

				Promise.all(promises)
					.then((results: { date: moment.Moment; role: IRole; user: User; }[]) => {
						const mandates = ([] as { date: moment.Moment; role: IRole; user: User; }[]).concat.apply([], results);
						mandates.sort((a, b) => a.date.isBefore(b.date) ? 1 : (a.date.isAfter(b.date) ? -1 : 0));

						const dates = [] as any;
						mandates.forEach(mandate => {
							if (!(mandate.date.format("YYYY-MM-DD") in dates)) dates[mandate.date.format("YYYY-MM-DD")] = [];
							dates[mandate.date.format("YYYY-MM-DD")].push(mandate);
						});

						events = Object.keys(dates).map(key => ({
							date: dates[key][0].date,
							type: "DFUNKT",
							mandates: dates[key]
						}));
					})
					.then(() => resolve(events));
			});


		// fetch('https://dfunkt.datasektionen.se/api/roles')
		// 	.catch(x => console.log('Couldn\'t fetch dfunkt roles list'))
		// .then(res => res.json())
		// 	.catch(x => console.log('Couldn\'t parse dfunkt roles list'))
		// .then(roles => {
		// 	let promises = []
		// 	roles.forEach(role => promises.push(fetchMandatesForRole(role)))

		// 	Promise.all(promises)
		// 		.then(results => {
		// 			const mandates = [].concat.apply([], results)
		// 			mandates.sort((a, b) => {
		// 					if (a.date.isBefore(b.date)) {
		// 						return 1
		// 					}
		// 					if (a.date.isAfter(b.date)) {
		// 						return -1
		// 					}
		// 					return 0
		// 				})

		// 			const dates = []
		// 			mandates.forEach(mandate => {
		// 				if (!(mandate.date.format("YYYY-MM-DD") in dates)) {
		// 					dates[mandate.date.format("YYYY-MM-DD")] = []
		// 				}
		// 				dates[mandate.date.format("YYYY-MM-DD")].push(mandate)
		// 			})

		// 			events = Object.keys(dates).map(key => ({
		// 				date: dates[key][0].date,
		// 		    	template: 'dfunkt',
		// 		    	mandates: dates[key],
		// 			}))
		// 		})
		// 		.then(_ => resolve(events))
		// })
	});
};
