# SF Icons

Icon font for Sunlight Foundation


## Install

1. Include minified CSS from the Sunlight CDN. The current version is `0.2`

    ```
    <link rel="stylesheet" href="http://sunlight-cdn.s3.amazonaws.com/sf-icons/:version/css/sf-icons.css">
    ```
    If IE8 support is needed, include the following at the bottom of your page:
    
    ```
	<!--[if IE 8]>
		<script src="http://sunlight-cdn.s3.amazonaws.com/sf-icons/:version/js/sf-icons.js"></script>
	<![endif]-->
    ```

## Development
1. Clone this repo.
2. Add new svg icons to the directory `/src/fonts`.
3. Increment the version in `package.json`.
4. Run the server with `gulp connect` and review changes to the iconfont at `localhost:4000`.
5. Run `gulp` or `gulp build` to rebuild all the font files.
6. Commit and push your changes.
7. Tag the release by running `gulp tag`.
8. Push your tag by running `git push --tags`
9. Publish to S3 by running `gulp publish`. You will need valid S3 credentials in your `aws.json` file to do so.
