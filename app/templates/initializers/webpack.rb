if Rails.configuration.webpack[:use_manifest]
  asset_manifest  = Rails.root.join('public', 'assets', 'webpack-asset-manifest.json')
  common_manifest = Rails.root.join('public', 'assets', 'webpack-common-manifest.json')

  if File.exist?(asset_manifest)
    Rails.configuration.webpack[:asset_manifest] = JSON.parse(
      File.read(asset_manifest),
    ).with_indifferent_access
  end

  if File.exist?(common_manifest)
    Rails.configuration.webpack[:common_manifest] = JSON.parse(
      File.read(common_manifest),
    ).with_indifferent_access
  end
end
