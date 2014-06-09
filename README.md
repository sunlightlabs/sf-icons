# SF Icons

Icon font for Sunlight Foundation

## Using sf-icons in your project

Include minified CSS from the Sunlight CDN. The current version is `0.2`.

    <link rel="stylesheet" href="http://sunlight-cdn.s3.amazonaws.com/sf-icons/:version/css/sf-icons.css">

If IE8 support is needed, include the following at the bottom of your page:
    
	<!--[if IE 8]>
		<script src="http://sunlight-cdn.s3.amazonaws.com/sf-icons/:version/js/sf-icons.js"></script>
	<![endif]-->

## Development

### Install dependencies and configuration

1. `brew bundle`
1. `bundle`
1. `npm install`
1. `npm install -g gulp`
1. `cp aws.json.example aws.json` and edit *aws.json*

### Build and deploy

1. Clone this repo.
1. Add new svg icons to the directory *src/fonts*.
1. Increment the version in *package.json*.
1. Run `gulp build` to rebuild all the font files.
1. Run the server with `gulp connect` and review changes to the iconfont at [http://localhost:4000](http://localhost:4000).
1. Commit and push your changes.
1. Tag the release by running `gulp tag`.
1. Push your changes by running `git push origin master`
1. Push your tag by running `git push --tags`
1. Publish to S3 by running `gulp publish`. You will need valid S3 credentials in your *aws.json* file to do so.
