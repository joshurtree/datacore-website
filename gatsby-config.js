require('dotenv').config();
module.exports = {
	siteMetadata: {
		title: 'Star Trek Timelines DataCore',
		titleTemplate: `%s - Star Trek Timelines DataCore`,
		description: `DataCore is a companion resource to Tilting Point's Star Trek Timelines game. It's designed as a compendium of data, statistics and assets, both extracted from the game as well as user generated.`,
		baseUrl: 'https://datacore.app',
	},
	plugins: [
		`gatsby-transformer-remark`,
		`gatsby-transformer-json`,
		`gatsby-plugin-react-helmet`,
		`gatsby-plugin-typescript`,
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'pages',
				path: `${__dirname}/static/pages/`
			}
		},
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'crew',
				path: `${__dirname}/static/crew/`
			}
		},
		{
			resolve: 'gatsby-source-filesystem',
			options: {
				name: 'structured',
				path: `${__dirname}/static/structured/`,
				ignore: [
					'**/events/*',
					'**/eventlogs/*',
					'**/collections.json',
					'**/dilemmas.json',
					'**/disputes.json',
					'**/event_instances.json',
					'**/event_leaderboards.json',
					'**/factions.json',
					'**/items.json',
					'**/keystones.json',
					'**/misc_stats.json',
					'**/missions.json',
					'**/missionsfull.json',
					'**/quests.json',
					'**/ship_schematics.json',
					'**/upcomingevents.json'
				]
			}
		},
		{
			resolve: `gatsby-plugin-manifest`,
			options: {
				name: `Star Trek Timelines DataCore`,
				short_name: `DataCore`,
				start_url: `/`,
				background_color: `#3A3F44`,
				theme_color: `#272B30`,
				display: `standalone`,
				icon: `src/images/logo.svg`,
				include_favicon: true
			}
		}
	]
};
