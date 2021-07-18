<script>
export default {
	onLaunch: function() {
		console.log('App Launch');
	},
	onShow: function() {
		console.log('App Show');
	},
	onHide: function() {
		console.log('App Hide');
	},
	globalData: {
		background: {
			'background-image': 'linear-gradient(45deg, rgb(28, 187, 180), rgb(141, 198, 63))'
		},
		appid: 'wx0bf6089943ddea2b',
	}
};
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
</style>
