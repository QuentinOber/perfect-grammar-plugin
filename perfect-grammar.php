<?php 
/*
Plugin Name: Perfect Grammar Plugin   
Description: A plugin to better teach and learn language grammar
Version: 1.0.3
Author: Quentin Ober
Author URI: https://www.linkedin.com/in/quentinober/
Text Domain: perfectgrammar
Domain Path: /languages

*/

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 * 
 */


define( 'PERFECT_GRAMMAR_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-perfect-grammar-activator.php
 */
function activate_perfect_grammar() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-perfect-grammar-activator.php';
	Perfect_Grammar_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-perfect-grammar-deactivator.php
 */
function deactivate_perfect_grammar() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-perfect-grammar-deactivator.php';
	Perfect_Grammar_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_perfect_grammar' );
register_deactivation_hook( __FILE__, 'deactivate_perfect_grammar' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-perfect-grammar.php';



/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_perfect_grammar() {

	$plugin = new Perfect_Grammar();
	$plugin->run();

}
run_perfect_grammar(); 






/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */


 /**
 * TO ORGANIZE LOGIC LATER ON
 **/



function enqueue_perfect_grammar_custom_scripts() {
    // Get the plugin data to fetch the version number
    $plugin_data = get_file_data(__FILE__, array('Version' => 'Version'), false);
    $plugin_version = $plugin_data['Version'];

		global $wp;
    $current_url = home_url(add_query_arg(array(), $wp->request));

		if (strpos($current_url, 'checklist') === false && strpos($current_url, 'class-activity') === false) {
			return;
	}

	wp_enqueue_script('perfect-grammar-main-scripts', plugin_dir_url(__FILE__) . 'build/index.js', array(), $plugin_version, true);
	wp_enqueue_style('perfect-grammar-main-styles', plugin_dir_url(__FILE__) . 'build/index.css', array(), $plugin_version);

    // Localize the script with new data
    $script_data_array = array(
        'root' => esc_url_raw(rest_url()),
        'nonce' => wp_create_nonce('wp_rest')
    );
    wp_localize_script('perfect-grammar-main-scripts', 'wpApiSettings', $script_data_array);

	// localize if user is logged in
	wp_localize_script('perfect-grammar-main-scripts', 'user_status', array(
		'logged_in' => is_user_logged_in()));
}
add_action('wp_enqueue_scripts', 'enqueue_perfect_grammar_custom_scripts');

