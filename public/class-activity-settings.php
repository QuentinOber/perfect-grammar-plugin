<?php

class Set_Class_Activity_Post_Templates  {
    public function __construct() {
        // Post Types
        add_action('init', array($this, 'register_class_activity_post_type'), 99);
        add_action('init', array($this, 'register_saved_activity_post_type'), 99);

        
        // Meta boxes
        add_action('add_meta_boxes', array($this, 'add_meta_boxes'));
        add_action('save_post', array($this, 'save_meta_boxes'), 80);
        
        // Taxonomies
        add_action('init', array($this, 'register_class_activity_taxonomy'));
        add_action('init', array($this, 'register_class_activity_tags_taxonomy'));

        // Templates
        add_filter('single_template', array($this, 'get_class_activity_single_template'));
        add_filter('archive_template', array($this, 'get_class_activity_archive_template'));

        // Post meta done_post_id
        register_post_meta( 'saved_activity', 'saved_activity_id', array(
            'show_in_rest' => true,
            'single' => true,
            'type' => 'integer',
        ) );

        // Save meta box data when using REST API
        add_action('rest_after_insert_done_activity', array($this, 'api_save_activity_meta_boxes'), 80, 2);
    }

 
// Register Custom Post Type
public function register_class_activity_post_type() {

	$labels = array(
		'name'                  => _x( 'Class Activity', 'Post Type General Name', 'text_domain' ),
		'singular_name'         => _x( 'Class Activity', 'Post Type Singular Name', 'text_domain' ),
		'menu_name'             => __( 'Class Activities', 'text_domain' ),
		'name_admin_bar'        => __( 'Class Activity', 'text_domain' ),
		'archives'              => __( 'Activity Archives', 'text_domain' ),
		'attributes'            => __( 'Activity Attributes', 'text_domain' ),
		'parent_item_colon'     => __( 'Parent Activity:', 'text_domain' ),
		'all_items'             => __( 'All Activities', 'text_domain' ),
		'add_new_item'          => __( 'Add New Activity', 'text_domain' ),
		'add_new'               => __( 'Add New', 'text_domain' ),
		'new_item'              => __( 'New Activity', 'text_domain' ),
		'edit_item'             => __( 'Edit Activity', 'text_domain' ),
		'update_item'           => __( 'Update Activity', 'text_domain' ),
		'view_item'             => __( 'View Activity', 'text_domain' ),
		'view_items'            => __( 'View Activities', 'text_domain' ),
		'search_items'          => __( 'Search Activity', 'text_domain' ),
		'not_found'             => __( 'Not found', 'text_domain' ),
		'not_found_in_trash'    => __( 'Not found in Trash', 'text_domain' ),
		'featured_image'        => __( 'Featured Image', 'text_domain' ),
		'set_featured_image'    => __( 'Set featured image', 'text_domain' ),
		'remove_featured_image' => __( 'Remove featured image', 'text_domain' ),
		'use_featured_image'    => __( 'Use as featured image', 'text_domain' ),
		'insert_into_item'      => __( 'Insert into Activity', 'text_domain' ),
		'uploaded_to_this_item' => __( 'Uploaded to this item', 'text_domain' ),
		'items_list'            => __( 'Activities list', 'text_domain' ),
		'items_list_navigation' => __( 'Activities list navigation', 'text_domain' ),
		'filter_items_list'     => __( 'Filter Activities list', 'text_domain' ),
	);
	$args = array(
		'label'                 => __( 'Class Activity', 'text_domain' ),
		'description'           => __( 'CLass activity for teacher', 'text_domain' ),
		'labels'                => $labels,
		'supports'              => array('title', 'editor', 'comments', 'revisions', 'author'),
		'hierarchical'          => false,
		'public'                => true,
		'delete_with_user'		=> false,
		'show_ui'               => true,
		'show_in_menu'          => true,
		'menu_position'         => 5,
		'show_in_admin_bar'     => true,
		'show_in_nav_menus'     => true,
		'can_export'            => true,
		'has_archive'           => true,
		'exclude_from_search'   => false,
		'publicly_queryable'    => true,
		'capability_type'       => 'post',
        'show_in_rest' => true,
	);
	register_post_type( 'class-activity', $args );

}   


      // CREATE THE SAVED ACTIVITY POST TYPE
      function register_saved_activity_post_type() {
        register_post_type('saved_activity', array(
            'labels' => array(
                'name' => __('Saved Activities'),
                'singular_name' => __('Saved Activity'),
            ),
            'public' => true,
            'show_ui' => true,
            'capability_type' => 'post',
            'hierarchical' => false,
            'supports' => array('title', 'author', 'custom-fields'),
            'rewrite' => false,
            'menu_icon' => 'dashicons-heart',
            'show_in_rest' => false,
            'map_meta_cap'       => true,
            'capabilities' => array(
                'publish_posts' => 'publish_saved_activities',
                'edit_posts' => 'edit_saved_activities',
                'edit_others_posts' => 'edit_others_saved_activities',
                'delete_posts' => 'delete_saved_activities',
                'delete_others_posts' => 'delete_others_saved_activities',
                'read_private_posts' => 'read_private_saved_activities',
                'edit_post' => 'edit_saved_activity',
                'delete_post' => 'delete_saved_activity',
                'read_post' => 'read_saved_activity',
            ),
       
        ));
      }


        /* ADD ALL META BOX */

        function add_meta_boxes() {
            add_meta_box(
                'activity_level',
                'Niveau de l\'activité',
                array($this, 'render_activity_meta_box'),
                'class-activity',
                'normal',
                'default'
            );    

                add_meta_box(
                    'estimated_time',
                    'Temps estimé',
                    array($this, 'render_estimated_time'),
                    'class-activity',
                    'normal',
                    'default'
                );
            
                add_meta_box(
                    'tutor_instructions_meta_box',
                    'Instructions pour tuteurs',
                    array($this,'render_tutor_instructions_meta_box'),
                    'class-activity', 
                    'normal',
                    'high'
                );
            }


        
        
        function save_meta_boxes($post_id) {
            if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
                return;
            }
    
            if (!current_user_can('edit_post', $post_id)) {
                return;
            }
            // Saving activity level options
            if (isset($_POST['activity_level_options'])) {
                $options = (array) $_POST['activity_level_options'];
                update_post_meta($post_id, 'activity_level_options', $options);
            } else {
                delete_post_meta($post_id, 'activity_level_options');
            }

            // estimated time 
            if (isset($_POST['estimated_time'])) {
                update_post_meta($post_id, 'estimated_time', sanitize_text_field($_POST['estimated_time']));
            }

            // Save tutor instructions meta box data
            if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
                return;
            }

            if (!current_user_can('edit_post', $post_id)) {
                return;
            }

            if (isset($_POST['tutor_instructions_field'])) {
                $tutor_instructions = $_POST['tutor_instructions_field'];
                update_post_meta($post_id, 'tutor_instructions', $tutor_instructions);
            }
    
          
     
        }
    
        /* RENDER ACTIVITY LEVEL   */

     
   
        function render_activity_meta_box($post) {
            $options = get_post_meta($post->ID, 'activity_level_options', true);
    
            $checkbox_options = [
                'A0' => 'A0',
                'A1' => 'A1',
                'A2' => 'A2',
                'B1' => 'B1',
                'B2' => 'B2',
                'C1' => 'C1',
                'C2' => 'C2'
            ];
    
            foreach ($checkbox_options as $label => $value) {
                $checked = in_array($value, (array) $options) ? 'checked' : '';
                echo '<label>';
                echo '<input type="checkbox" name="activity_level_options[]" value="' . esc_attr($value) . '" ' . $checked . '>';
                echo esc_html($label);
                echo '</label><br>';
            }
        }

        

            // Render estimated time
           function render_estimated_time($post) {
                $value = get_post_meta($post->ID, 'estimated_time', true);
                ?>
                <label for="estimated_time">Temps estimé (en minutes !) :</label>
                <input type="text" id="estimated-time-number" name="estimated_time" value="<?php echo esc_attr($value); ?>">
                <?php
            }

            // Render tutor content

            function render_tutor_instructions_meta_box($post) {
                $value = get_post_meta($post->ID, 'tutor_instructions', true);
                ?>
                <textarea id="tutor-instructions" name="tutor_instructions_field" rows="5" style="width: 100%;"><?php echo esc_textarea($value); ?></textarea>
                <?php
            }

   
       






/* CUSTOM TAXYMONY */

function register_class_activity_taxonomy() {
    $args = array(
        'hierarchical'      => true,
        'show_in_rest' => true,
        'labels'            => array(
            'name'              => 'Class Categories',
            'singular_name'     => 'Class Category',
        ),
        'public'            => true,
        'show_admin_column' => true,
        'rewrite'           => array( 'slug' => 'class-activity-category' ),
        'meta_box_cb' => 'post_categories_meta_box', 

    );
    register_taxonomy( 'class-activity-category', 'class-activity', $args );
}



/* CUSTOM TAGS. */

function register_class_activity_tags_taxonomy() {
    $labels = array(
        'name'              => _x('Class activity Tags', 'taxonomy general name'),
        'singular_name'     => _x('Class activity  Tag', 'taxonomy singular name'),
        'search_items'      => __('Search Class activity Tags'),
        'all_items'         => __('All Class activity Tags'),
        'parent_item'       => __('Parent Class activity  Tag'),
        'parent_item_colon' => __('Parent Class activity  Tag:'),
        'edit_item'         => __('Edit Class activity  Tag'),
        'update_item'       => __('Update Class activity  Tag'),
        'add_new_item'      => __('Add New Class activity  Tag'),
        'new_item_name'     => __('New Class activity  Name'),
        'menu_name'         => __('Class Tags'),
    );

    $args = array(
        'hierarchical'      => false,
        'labels'            => $labels,
        'show_in_rest' => true,
        'public'            => true,
        'show_ui'           => true,
        'show_admin_column' => true,
        'show_in_nav_menus' => true,
        'show_tagcloud'     => true,
        'rewrite'           => array('slug' => 'class-activity-tags'), 
    );

    register_taxonomy('class-activity-tag', 'class-activity', $args); 
}



/* TEMPLATE SINGLE */

function get_class_activity_single_template($single_template) {
    if (is_singular('class-activity')) {
        $single_template = plugin_dir_path(__FILE__) . '../templates/single-class-activity.php';

        if (file_exists($single_template)) {
            return $single_template;
        }
    }


    return $single_template;
}

/* TEMPLATE ARCHIVE */
public function get_class_activity_archive_template($archive_template) {
    if (is_post_type_archive('class-activity')) {
        $new_template = plugin_dir_path(__FILE__) . '../templates/archive-class-activity.php';
        if (file_exists($new_template)) {
            return $new_template;
        }
    }
    return $archive_template;
}


}

new Set_Class_Activity_Post_Templates();







// ROLES FOR SAVED_EXERCISE 


function add_saved_activity_caps() {
    global $wp_roles;
    if (!isset($wp_roles))
        $wp_roles = new WP_Roles();

    foreach($wp_roles->roles as $roleName => $details){
        $role = get_role( $roleName );

        $role->add_cap( 'publish_saved_activitys' );
        $role->add_cap( 'edit_saved_activitys' );
        $role->add_cap( 'delete_saved_activitys' );
        $role->add_cap( 'read_saved_activity' );
    }

    // ADMIN ONLY
    $admins = get_role( 'administrator' );
    $admins->add_cap( 'edit_others_saved_activitys' );
    $admins->add_cap( 'delete_others_saved_activitys' );
    $admins->add_cap( 'read_private_saved_activitys' );
}

add_action( 'admin_init', 'add_saved_activity_caps');
?>