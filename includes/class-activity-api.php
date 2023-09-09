<?php

/**
 * Register all CUSTON API for Class Activity
 *
 * @link       http://ecole601.com
 * @since      1.0.0
 *
 * @package    Perfect_Grammar
 * @subpackage Perfect_Grammar/includes
 */

 // TO GET MINIMAL ACTIVITIES WITH ONLY NEEDED DATA FOR ARCHIVE & THEIR CUSTOM METAS 
add_action('rest_api_init', 'register_minimal_activities_api_endpoint');

function register_minimal_activities_api_endpoint() {
        register_rest_route('perfect-grammar/v1', 'activity/archive', array(
            'methods' => WP_REST_SERVER::READABLE,
            'callback' => 'get_minimal_activities_data',
            'permission_callback' => '__return_true', 
            'args' => array(
                'lang' => array(
                    'required' => false,
                    'default' => null,
                    'sanitize_callback' => 'sanitize_text_field',
                ),
            ),
        ));

}

function get_minimal_activities_data(WP_REST_Request $request) {
    $current_user_id = get_current_user_id();
    $lang = $request->get_param('lang');

    $minimal_activities_query = new WP_Query(array(
        'post_type' => array('class-activity'),
        'posts_per_page' => -1,
    ));


    $minimal_activities_data = array();

while($minimal_activities_query->have_posts()) {
    $minimal_activities_query->the_post();

    $activity_level = get_post_meta(get_the_ID(), 'activity_level_options', true); // get the activity level
    $activity_time_estimated = get_post_meta(get_the_ID(), 'estimated_time', true);
    $category = wp_get_post_terms(get_the_ID(), 'class-activity-category', array('fields' => 'names')); // get the activity categories
    $tags = wp_get_post_terms(get_the_ID(), 'class-activity-tag', array('fields' => 'names')); // get all the tags
    $nonce = wp_create_nonce('wp_rest');

    // Get post's permalink
    $permalink = get_the_permalink();

    if ( defined( 'ICL_SITEPRESS_VERSION' ) ) {
        $permalink = apply_filters( 'wpml_permalink', $permalink , $lang);
    }

    
        $is_saved = false; // Assume not saved
        $saved_id = null; // Assume no saved_post


        if ($current_user_id > 0) {
            // Check if this activity is done by the current user
            $saved_activity_query = new WP_Query(array(
              'post_type' => array('saved_post'),
              'posts_per_page' => 1,
              'author' => $current_user_id, // filter by author
              'meta_query' => array(
                  array(
                      'key' => 'saved_post_id',
                      'value' => get_the_ID(),
                      'compare' => '=',
                  ),
              ),
          ));
            if ($saved_activity_query->have_posts()) {
              $is_saved = true;
              $saved_id = $saved_activity_query->posts[0]->ID;
          }
      }

    array_push($minimal_activities_data, array(
        'postId' => get_the_ID(),
        'title' => get_the_title(),
        'permalink'=> $permalink,
        'level'=> $activity_level,
        'estimatedTime' => $activity_time_estimated,
        'category' => $category,
        'tags' => $tags,
        'isSaved' => $is_saved,
        'savedId' => $saved_id


    ));


}
wp_reset_postdata();

return $minimal_activities_data;
}

// SINGLE ACTIVITY

add_action('rest_api_init', 'register_single_activity_api_endpoint');

function register_single_activity_api_endpoint() {
    register_rest_route('perfect-grammar/v1', '/activity/(?P<id>\d+)', array(
        'methods' => WP_REST_SERVER::READABLE,
        'callback' => 'get_single_activity_data',
        'permission_callback' => '__return_true', 
    ));
}


function get_single_activity_data($request) {
    $activity_id = $request->get_param('id');
    $current_user_id = get_current_user_id();


    // Retrieve the activity post data using the ID
    $activity_data = get_post($activity_id);

    if (empty($activity_data)) {
        return new WP_Error('activity_not_found', 'Class Activity not found', array('status' => 404));
    }

    $post_content =  $activity_data->post_content;
    $post_content = apply_filters('the_content', $post_content);
    $post_content = str_replace(']]>', ']]&gt;', $post_content);
    $activity_level = get_post_meta($activity_id, 'activity_level_options', true); // get the activity level
    $activity_time_estimated = get_post_meta($activity_id, 'estimated_time', true);
    $category = wp_get_post_terms($activity_id, 'class-activity-category', array('fields' => 'names')); // get the activity categories
    $tags = wp_get_post_terms($activity_id, 'class-activity-tag', array('fields' => 'names')); // get all the tags
    $tutor_instructions = get_post_meta($activity_id, 'tutor_instructions', true);
    $is_saved = false; // Assume not saved
    $saved_id = null; 

    if ($current_user_id > 0) {
     // Check if this activity is saved by the current user
     $saved_activity_query = new WP_Query(array(
        'post_type' => array('saved_post'),
        'posts_per_page' => 1,
        'author' => $current_user_id, 
        'meta_query' => array(
            array(
                'key' => 'saved_post_id',
                'value' => $activity_id,
                'compare' => '=',
            ),
        ),
    ));
   $is_saved = $saved_activity_query->have_posts();
    $saved_id = $saved_activity_query->posts[0]->ID;
    }  

    $response_data = array(
        'postId' => $activity_data->ID,
        'title' => $activity_data->post_title,
        'content' => $post_content,
        'level'=> $activity_level,
        'estimatedTime' =>  $activity_time_estimated,
        'category' => $category,
        'tags'=> $tags,
        'instructions' => $tutor_instructions,
        'isSaved'=> $is_saved,
        'savedId' => $saved_id,
        'useId' => $current_user_id
        
    );

    // Return the response data
    return $response_data;
}

// get random activity



function get_random_activity(WP_REST_Request $request) {
    $lang = $request->get_param('lang');

    $random_activity_query = new WP_Query(array(
        'post_type' => 'class-activity',
        'orderby'   => 'rand',
        'posts_per_page' => 1,
    ));

    if($random_activity_query->have_posts()){
        while ($random_activity_query->have_posts()) {
            $random_activity_query->the_post();

            $permalink = get_the_permalink();

            // Append language to the URL
            if ( defined( 'ICL_SITEPRESS_VERSION' ) ) {
        $permalink = apply_filters( 'wpml_permalink', $permalink , $lang);
    }
                // Redirect to the post in the desired language
                wp_redirect($permalink);
                exit;
           
        }
    } else {
        return new WP_Error( 'no_posts', 'There are no posts', array( 'status' => 404 ) );
    }
}

add_action('rest_api_init', function() {
    register_rest_route( 'perfect-grammar/v1', '/activity/random/', array(
        'methods' => 'GET',
        'callback' => 'get_random_activity',
        'permission_callback' => '__return_true',
        'args' => array(
            'lang' => array(
                'required' => false,
                'default' => null,
                'sanitize_callback' => 'sanitize_text_field',
            ),
        ),
    ));
});