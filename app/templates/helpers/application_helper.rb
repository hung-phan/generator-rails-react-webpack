module ApplicationHelper
  def webpack_bundle_tag(bundle)
    src =
      if Rails.configuration.webpack[:use_manifest]
        manifest = Rails.configuration.webpack[:asset_manifest][bundle]
        bundle = manifest.instance_of?(Array) ? manifest[0] : manifest

        "/assets/#{bundle}"
      else
        #"http://localhost:8080/assets/build/#{bundle}.bundle.js" # Hot module replacement
        "/assets/build/#{bundle}.bundle"
      end

    "<script src='#{src}' type='text/javascript'></script>".html_safe
  end

  def webpack_manifest_script
    return '' unless Rails.configuration.webpack[:use_manifest]
    javascript_tag "window.webpackManifest = #{Rails.configuration.webpack[:common_manifest].to_json}"
  end
end

