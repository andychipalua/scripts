<?php

error_reporting(E_ERROR | E_PARSE);
$processed = 0;
$exclude_from_params = ["redirect_url", "post_redirect_url", "return_url", "redirect_url"];
$escape_extensions = [".jpg", ".jpeg", ".png", ".gif"];
$start_url = $argv[1];
$internal_urls = [$start_url];
$internal_url_keys = [
    $start_url => count($internal_urls) - 1
];
libxml_use_internal_errors(false);
$script_directory = dirname(__FILE__);
$output_file = $script_directory . "/urls_" .date("YmdHis") . ".txt";
$output_file_csv = $script_directory . "/result_csv" .time() . ".txt";

$all_outputs = "";
do {
    $url = $internal_urls[$processed];
    $curl_output = makeCurlCall($url, "load_time_1");
    $curl_output2 = makeCurlCall($url, "load_time_2");
    $store_output = array_merge($curl_output, $curl_output2);
    unset($store_output['page']);
    //$store_output['load_time_2'] = $curl_output2['load_time'];

    $processed++;
    if (empty($curl_output['page'])) {
        $store_output['has_content'] = "NO";
    } else {
        $store_output['has_content'] = "YES";
        $dom = new DOMDocument();
        $dom->loadHTML($curl_output['page']);

        $ahrefs = $dom->getElementsByTagName('a');

        foreach ($ahrefs as $ahref_elem) {
            foreach ($ahref_elem->attributes as $attr) {
                if (
                    $attr->nodeName == "href" 
                    && str_starts_with($attr->nodeValue, $start_url)
                    && !isset($internal_url_keys[$attr->nodeValue])
                ) {

                    $new_internal_url = $attr->nodeValue;
                    if (array_contains($new_internal_url, $escape_extensions)) {
                        break;
                    }
                    $url_components = parse_url($new_internal_url);
                    $found = false;
                    if (!empty($url_components['query'])) {
                        parse_str($url_components['query'], $query_params);
                        foreach ($exclude_from_params as $excludig) {
                            if (isset($query_params[$excludig])) {
                                $found = true;
                            }
                            unset($query_params[$excludig]);
                        }
                        $url_components['query'] = http_build_query($query_params);
                        $new_internal_url = build_url($url_components);
                    }
                    if (!isset($internal_url_keys[$attr->nodeValue])) {
                        $internal_url_keys[$new_internal_url] = count($internal_url_keys);
                        $internal_urls[] = $new_internal_url;
                    }
                    break;
                }
            }
        }
    }
    echo json_encode($store_output) . "\n";
    $all_outputs .=  implode(", ", $store_output) . "\n";
    file_put_contents($output_file, implode("\n", $internal_urls));
    file_put_contents($output_file_csv, $all_outputs);
    // print_r($internal_urls);die;
} while(count($internal_urls) > $processed);


libxml_use_internal_errors(true);

print_r($new_internal_url);

function makeCurlCall($url, $load_time_key): array {
    $start_time = microtime(true);
    $ch = curl_init();

    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");

    $headers = array();
    curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

    $start_time = microtime(true);
    $result = curl_exec($ch);
    $end_time = microtime(true);
    $load_time = $end_time - $start_time;
    if (curl_errno($ch)) {
        $curl_error = curl_error($ch);
    }
    $response_type = curl_getinfo($ch,CURLINFO_HTTP_CODE);
    
    curl_close($ch);
    $result2 = [
        'url' => $url,
        'page' => $result,
        $load_time_key => $load_time,
        'error' => $curl_error,
        'response_type' => $response_type
    ];
    return $result2;
}

function build_url($components)
{
    $url = $components['scheme'] . '://';

    if ( ! empty($components['username']) && ! empty($components['password'])) {
        $url .= $components['username'] . ':' . $components['password'] . '@';
    }

    $url .= $components['host'];

    if ( ! empty($components['port']) &&
        (($components['scheme'] === 'http' && $components['port'] !== 80) ||
        ($components['scheme'] === 'https' && $components['port'] !== 443))
    ) {
        $url .= ':' . $components['port'];
    }

    if ( ! empty($components['path'])) {
        $url .= $components['path'];
    }

    if ( ! empty($components['fragment'])) {
        $url .= '#' . $components['fragment'];
    }

    if ( ! empty($components['query'])) {
        $url .= '?' . $components['query'];
    }

    return $url;
}

function array_contains($str, array $arr){
    foreach($arr as $a){
        if(stripos($str, $a) !== false) return true;
    }
    return false;
}
 ?>
