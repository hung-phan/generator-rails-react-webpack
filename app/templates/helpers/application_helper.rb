module ApplicationHelper
  def webpack_js_tag(bundle)
    src =
      if Rails.configuration.webpack[:use_manifest]
        manifest = Rails.configuration.webpack[:asset_manifest][bundle]
        bundle = manifest.instance_of?(Array) ? manifest[0] : manifest

        "/assets/#{bundle}"
      else
        "http://localhost:8080/assets/build/#{bundle}" # Hot module replacement
      end

    "<script src='#{src}' type='text/javascript'></script>".html_safe
  end

  def webpack_css_tag(bundle)
    if Rails.configuration.webpack[:use_manifest]
      manifest = Rails.configuration.webpack[:asset_manifest][bundle]
      bundle = manifest.instance_of?(Array) ? manifest[0] : manifest

      "<link rel='stylesheet' media='all' href='/assets/#{bundle}'>".html_safe
    else
      "".html_safe
    end
  end

  def webpack_manifest_script
    return '' unless Rails.configuration.webpack[:use_manifest]
    javascript_tag "window.webpackManifest = #{Rails.configuration.webpack[:common_manifest].to_json}"
  end
end
