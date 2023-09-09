<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Perfect_Grammar
 * @subpackage Perfect_Grammar/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Perfect_Grammar
 * @subpackage Perfect_Grammar/public
 * @author     Your Name <email@example.com>
 */
class Perfect_Grammar_Public {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $perfect_grammar;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $perfect_grammar       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $perfect_grammar, $version ) {

		$this->perfect_grammar = $perfect_grammar;
		$this->version = $version;
		$this->load_dependencies();

	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Plugin_Name_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Plugin_Name_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->perfect_grammar, plugin_dir_url( __FILE__ ) . 'css/perfect-grammar-public.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in perfect_grammar_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The perfect_grammar_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		// wp_enqueue_script( $this->perfect_grammar, plugin_dir_url( __FILE__ ) . 'public/js/perfect-grammar-public.js', array( '' ), $this->version, false );
		//wp_enqueue_script( $this->perfect_grammar, plugin_dir_url( __FILE__ ) . 'public/js/single-exercise.js', array( '' ), $this->version, false );

	}


	public function load_dependencies() {

		
		require_once plugin_dir_path ( dirname( __FILE__ ) ) . 'public/exercise-custom-post-setting.php';
		require_once plugin_dir_path(dirname( __FILE__ ) ) . 'public/class-activity-settings.php';
	}

}
