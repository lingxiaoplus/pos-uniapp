<script>
import pageAnimation from './components/page-animation'
export default {
	mixins: [pageAnimation],
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
		action: 'https://yangli.api.lingxiaomz.top/file',
		socket: 'wss://yangli.api.lingxiaomz.top/webSocket',
	}
};
</script>

<style lang="scss">
@import 'uview-ui/index.scss';
</style>
