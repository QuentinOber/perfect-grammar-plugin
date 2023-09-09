<?php 

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    Perfect_Grammar
 * @subpackage Perfect_Grammar/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Perfect_Grammar
 * @subpackage Perfect_Grammar/admin
 * @author     Quentin Ober <email@example.com>
 */
class Perfect_Grammar_Admin {

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
	 * @param      string    $perfect_grammar       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $perfect_grammar, $version ) {

		$this->perfect_grammar = $perfect_grammar;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
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

		wp_enqueue_style( $this->perfect_grammar, plugin_dir_url( __FILE__ ) . 'css/perfect-grammar-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
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

		wp_enqueue_script( $this->perfect_grammar, plugin_dir_url( __FILE__ ) . 'js/perfect-grammar-admin.js', array( 'jquery' ), $this->version, false );

	}

}


