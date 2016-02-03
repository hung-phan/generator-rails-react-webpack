desc 'compile bundles using webpack'
task "assets:precompile" do
  `npm run build`
end
