<?php

// THERE ARE TWO POST TYPE BEING CREATED: the main one ''exercise'' (with 3 custom metabox : exercise_level, exercise_video, exercise_test) 
// and two related 'done_post' (with the custom metabox: done_post_id ) and 'saved_post'
//
class Set_Exercise_Post_templates {
    public function __construct() {
        // Post Types
        add_action('init', array($this, 'register_exercise_post_type'), 99);
        add_action('init', array($this, 'register_done_post_post_type'), 99);
        add_action('init', array($this, 'register_saved_post_post_type'), 99);

        
        // Meta boxes
        add_action('add_meta_boxes', array($this, 'add_meta_boxes'));
        add_action('save_post', array($this, 'save_meta_boxes'), 80);
        
        // Taxonomies
        add_action('init', array($this, 'register_custom_exercise_taxonomy'));
        add_action('init', array($this, 'register_exercise_tags_taxonomy'));

        // Templates
        add_filter('single_template', array($this, 'get_exercise_single_template'));
        add_filter('archive_template', array($this, 'get_exercise_archive_template'));

        // Post meta done_post_id
        register_post_meta( 'done_post', 'done_post_id', array(
            'show_in_rest' => true,
            'single' => true,
            'type' => 'integer',
        ) );

        register_post_meta( 'saved_post', 'saved_post_id', array(
            'show_in_rest' => true,
            'single' => true,
            'type' => 'integer',
        ) );

        // Save meta box data when using REST API
        add_action('rest_after_insert_done_post', array($this, 'api_save_exercise_meta_boxes'), 80, 2);
    }
    

    public function api_done_exercise_meta_boxes($post, $request) {
        // Saving done exercise ID
        if (isset($request['done_post_id'])) {
            $done_post_id = absint($request['done_post_id']);
            update_post_meta($post->ID, 'done_post_id', $done_post_id);
        }

        if (isset($request['saved_post_id'])) {
            $saved_post_id = absint($request['saved_post_id']);
            update_post_meta($post->ID, 'saved_post_id', $saved_post_id);
        }
    }

 

    
    // CREATE THE EXERCISE POST TYPE
    public function register_exercise_post_type() {
        // exercise Post Type
        register_post_type('exercise', array(
        'show_in_rest' => true,
        'supports' => array('title', 'editor', 'comments', 'revisions'),
        'hierarchical' => false,
        'rewrite' => array('slug' => 'checklist'),
        'has_archive' => true,
        'public' => true,
        'show_ui'=> true,
        'taxonomies' => array('exercise-category', 'exercise-tag'),
        'show_in_admin_bar'=> true,
        'show_in_nav_menus'=> true,
        'capability_type' => 'post',
        'delete_with_user' => false,
        'menu_icon' => 'dashicons-welcome-learn-more',
        'capability_type'    => 'post',
        'map_meta_cap'       => true,
        'labels' => array(
            'name' => 'Exercises',
            'add_new_item' => 'Add New exercise',
            'edit_item' => 'Edit exercises',
            'all_items' => 'All exercises',
            'singular_name' => 'Exercise'
        ),
        ));  }


        // CREATE THE DONE EXERCISE POST TYPE
    public function register_done_post_post_type() {
        register_post_type('done_post', array(
            'labels' => array(
                'name' => __('Done Exercises'),
                'singular_name' => __('Done Exercise'),
            ),
            'public' => true,
            'show_ui' => true,
            'capability_type' => 'post',
            'hierarchical' => false,
            'supports' => array('title', 'author', 'custom-fields'),
            'rewrite' => false,
            'menu_icon' => 'dashicons-saved',
            'show_in_rest' => false,
            'map_meta_cap'       => true,
            'capabilities' => array(
                'publish_posts' => 'publish_done_exercises',
                'edit_posts' => 'edit_done_exercises',
                'edit_others_posts' => 'edit_others_done_exercises',
                'delete_posts' => 'delete_done_exercises',
                'delete_others_posts' => 'delete_others_done_exercises',
                'read_private_posts' => 'read_private_done_exercises',
                'edit_post' => 'edit_done_exercise',
                'delete_post' => 'delete_done_exercise',
                'read_post' => 'read_done_exercise',
            ),
       
        ));
      }

       // CREATE THE SAVED EXERCISE POST TYPE
    public function register_saved_post_post_type() {
        register_post_type('saved_post', array(
            'labels' => array(
                'name' => __('Saved Exercises'),
                'singular_name' => __('Saved Exercise'),
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
                'publish_posts' => 'publish_saved_exercises',
                'edit_posts' => 'edit_saved_exercises',
                'edit_others_posts' => 'edit_others_saved_exercises',
                'delete_posts' => 'delete_saved_exercises',
                'delete_others_posts' => 'delete_others_saved_exercises',
                'read_private_posts' => 'read_private_saved_exercises',
                'edit_post' => 'edit_saved_exercise',
                'delete_post' => 'delete_saved_exercise',
                'read_post' => 'read_saved_exercise',
            ),
       
        ));
      }

        /* ADD ALL META BOX */

        public function add_meta_boxes() {
            add_meta_box(
                'exercise_level',
                'Niveau exercice',
                array($this, 'render_exercise_meta_box'),
                'exercise',
                'normal',
                'default'
            );
    
            add_meta_box(
                'exercise_video',
                'Video Link',
                array($this, 'exercise_render_video_meta_box'),
                'exercise',
                'normal',
                'high'
            );
    
            add_meta_box(
                'exercise_test',
                'Tests, Quizs',
                array($this, 'exercise_render_test_meta_box'),
                'exercise',
                'normal',
                'high'
            );           
        }
        

        public function save_meta_boxes($post_id) {
            if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
                return;
            }
    
            if (!current_user_can('edit_post', $post_id)) {
                return;
            }
            // Saving exercise level options
            if (isset($_POST['exercise_level_options'])) {
                $options = (array) $_POST['exercise_level_options'];
                update_post_meta($post_id, 'exercise_level_options', $options);
            } else {
                delete_post_meta($post_id, 'exercise_level_options');
            }
    
            // Saving video link
            if (isset($_POST['video_link_field'])) {
                $video_link = $_POST['video_link_field'];
                update_post_meta($post_id, 'video_link', $video_link);
            }
    
            // Saving exercise test
            if (isset($_POST['exercise_test_field'])) {
                $exercise_test = $_POST['exercise_test_field'];
                update_post_meta($post_id, 'exercise_test', $exercise_test);
            }
     
        }
    
        /* RENDER EXERCISE LEVEL   */

     
   
        public function render_exercise_meta_box($post) {
            $options = get_post_meta($post->ID, 'exercise_level_options', true);
    
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
                echo '<input type="checkbox" name="exercise_level_options[]" value="' . esc_attr($value) . '" ' . $checked . '>';
                echo esc_html($label);
                echo '</label><br>';
            }
        }
   
       
     
                    /* RENDER CUSTOM FIELD TEST */

        
           public function exercise_render_test_meta_box($post) {
                // Retrieve the existing value from the database
                $value = get_post_meta($post->ID, 'exercise_test', true);
                  // Settings for the editor
    $settings = array(
        'textarea_name' => 'exercise_test_field', // Match the name of the original textarea
        'textarea_rows' => 5, // Number of rows
        'media_buttons' => false, // Enable/Disable media buttons
    );
    
    // Display the editor
    wp_editor($value, 'exercise_test_editor_id', $settings);
}
           
               /* RENDER CUSTOM FIELD VIDEO  */


               function exercise_render_video_meta_box($post) {
                // Retrieve the existing value from the database
                $val = get_post_meta($post->ID, 'video_link', true);
                $val = is_array($val) ? '' : $val;

                // Display the field
                ?>
                <textarea id="video-link" name="video_link_field"  rows="2" style="width: 100%;"><?php echo esc_textarea($val); ?></textarea>
                <?php
            }



        /* CUSTOM TAXYMONY */


function register_custom_exercise_taxonomy() {
    $args = array(
        'hierarchical'      => true,
        'show_in_rest' => true,
        'labels'            => array(
            'name'              => 'Exercise Categories',
            'singular_name'     => 'Exercise Category',
        ),
        'public'            => true,
        'show_admin_column' => true,
        'rewrite'           => array( 'slug' => 'exercise-category' ),
        'meta_box_cb' => 'post_categories_meta_box' // Use the default category meta box UI


    );
    register_taxonomy( 'exercise-category', 'exercise', $args );
}



         /* CUSTOM TAGS. */

function register_exercise_tags_taxonomy() {
    $labels = array(
        'name'              => _x('Exercise Tags', 'taxonomy general name'),
        'singular_name'     => _x('Exercise  Tag', 'taxonomy singular name'),
        'search_items'      => __('Search Exercise Tags'),
        'all_items'         => __('All Exercise Tags'),
        'parent_item'       => __('Parent Exercise  Tag'),
        'parent_item_colon' => __('Parent Exercise  Tag:'),
        'edit_item'         => __('Edit Exercise  Tag'),
        'update_item'       => __('Update Exercise  Tag'),
        'add_new_item'      => __('Add New Exercise  Tag'),
        'new_item_name'     => __('New Exercise  Name'),
        'menu_name'         => __('Exercise Tags'),
    );

    $args = array(
        'hierarchical'      => false,
        'labels'            => $labels,
        'public'            => true,
        'show_ui'           => true,
        'show_in_nav_menus' => true,
        'rewrite'           => array('slug' => 'exercise-tags'), 
        'show_in_rest' => true
    );

    register_taxonomy('exercise-tag', 'exercise', $args); 
}


    


    // TEMPLATES FOR EXERCISE

	/* TEMPLATE SINGLE */
    public function get_exercise_single_template($template) {
        if (is_singular('exercise')) {
            $custom_template = plugin_dir_path(__FILE__) . '../templates/single-exercise.php';

            if (file_exists($custom_template)) {
                return $custom_template;
            }
        }

        return $template;
    }
    public function get_exercise_archive_template($archive_template) {
        if (is_post_type_archive('exercise')) {
            $new_template = plugin_dir_path(__FILE__) . '../templates/archive-exercise.php';
            if (file_exists($new_template)) {
                return $new_template;
            }
        }
        return $archive_template;
    }
    

}

new Set_Exercise_Post_templates();



// ROLES FOR DONE_EXERCISE 

function add_done_exercise_caps() {
    global $wp_roles;
    if (!isset($wp_roles))
        $wp_roles = new WP_Roles();

    foreach($wp_roles->roles as $roleName => $details){
        $role = get_role( $roleName );

        $role->add_cap( 'publish_done_exercises' );
        $role->add_cap( 'edit_done_exercises' );
        $role->add_cap( 'delete_done_exercises' );
        $role->add_cap( 'read_done_exercise' );
    }

    // ADMIN ONLY
    $admins = get_role( 'administrator' );
    $admins->add_cap( 'edit_others_done_exercises' );
    $admins->add_cap( 'delete_others_done_exercises' );
    $admins->add_cap( 'read_private_done_exercises' );
}

add_action( 'admin_init', 'add_done_exercise_caps');


// ROLES FOR SAVED_EXERCISE 


function add_saved_exercise_caps() {
    global $wp_roles;
    if (!isset($wp_roles))
        $wp_roles = new WP_Roles();

    foreach($wp_roles->roles as $roleName => $details){
        $role = get_role( $roleName );

        $role->add_cap( 'publish_saved_exercises' );
        $role->add_cap( 'edit_saved_exercises' );
        $role->add_cap( 'delete_saved_exercises' );
        $role->add_cap( 'read_saved_exercise' );
    }

    // ADMIN ONLY
    $admins = get_role( 'administrator' );
    $admins->add_cap( 'edit_others_saved_exercises' );
    $admins->add_cap( 'delete_others_saved_exercises' );
    $admins->add_cap( 'read_private_saved_exercises' );
}

add_action( 'admin_init', 'add_saved_exercise_caps');