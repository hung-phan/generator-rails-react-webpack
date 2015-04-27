require 'pp'

desc 'compile bundles using webpack'
task "assets:precompile" do
  cmd    = 'webpack --config config/webpack/production.config.js --json'
  output = `#{cmd}`
  stats  = JSON.parse output

  File.open('./public/assets/webpack-asset-manifest.json', 'w') do |f|
    f.write stats['assetsByChunkName'].to_json
  end

  pp stats['assetsByChunkName']
end
