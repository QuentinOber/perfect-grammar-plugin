<?php

/**
 * Register all CUSTON API for Exercise
 *
 * @link       http://ecole601.com
 * @since      1.0.0
 *
 * @package    Perfect_Grammar
 * @subpackage Perfect_Grammar/includes
 */


add_action('rest_api_init', 'register_single_exercise_api_endpoint');

function register_single_exercise_api_endpoint() {
    register_rest_route('perfect-grammar/v1', '/exercise/(?P<id>\d+)', array(
        'methods' => WP_REST_SERVER::READABLE,
        'callback' => 'get_single_exercise_data',
        'permission_callback' => '__return_true', 
    ));
}


function get_single_exercise_data($request) {
    $exercise_id = $request->get_param('id');
    $current_user_id = get_current_user_id();


    // Retrieve the exercise post data using the ID
    $exercise_data = get_post($exercise_id);

    if (empty($exercise_data)) {
        return new WP_Error('exercise_not_found', 'Exercise not found', array('status' => 404));
    }

    $exercise_level = get_post_meta($exercise_id, 'exercise_level_options', true); // get the exercise level
    $category = wp_get_post_terms($exercise_id, 'exercise-category', array('fields' => 'names')); // get the exercise categories
    $tags = wp_get_post_terms($exercise_id, 'exercise-tag', array('fields' => 'names')); // get all the tags
    $video_link = get_post_meta($exercise_id, 'video_link', true); // get the video link

    $saved_id = null;
    $is_done = false;
    $done_id = null;

    if ($current_user_id > 0) {
     // Check if this exercise is saved by the current user
     $saved_exercise_query = new WP_Query(array(
        'post_type' => array('saved_post'),
        'posts_per_page' => 1,
        'author' => $current_user_id, // filter by author
        'meta_query' => array(
            array(
                'key' => 'saved_post_id',
                'value' => $exercise_id,
                'compare' => '=',
            ),
        ),
    ));
    $is_saved = $saved_exercise_query->have_posts();
    $saved_id = $saved_exercise_query->posts[0]->ID;

    $done_exercise_query = new WP_Query(array(
        'post_type' => array('done_post'),
        'posts_per_page' => 1,
        'author' => $current_user_id, // filter by author
        'meta_query' => array(
            array(
                'key' => 'done_post_id',
                'value' => $exercise_id,
                'compare' => '=',
            ),
        ),
    ));
    $is_done = $done_exercise_query->have_posts();
    $done_id = $done_exercise_query->posts[0]->ID;
}

    $response_data = array(
        'postId' => $exercise_data->ID,
        'title' => $exercise_data->post_title,
        'content' => $exercise_data->post_content,
        'level'=> $exercise_level,
        'category' => $category,
        'tags'=> $tags,
        'video' =>  $video_link,
        'isSaved'=> $is_saved,
        'savedId' => $saved_id,
        'isDone' => $is_done,
        'doneId' => $done_id,
    );

    // Return the response data
    return $response_data;
}


// TO GET MINIMAL EXERCISES WITH ONLY NEEDED DATA FOR ARCHIVE & THEIR CUSTOM METAS 
add_action('rest_api_init', 'register_minimal_exercises_api_endpoint');

function register_minimal_exercises_api_endpoint() {
        register_rest_route('perfect-grammar/v1', 'exercise/archive', array(
            'methods' => WP_REST_SERVER::READABLE,
            'callback' => 'get_minimal_exercises_data',
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

function get_minimal_exercises_data(WP_REST_Request $request) {
    $current_user_id = get_current_user_id();
    $lang = $request->get_param('lang');

    $minimal_exercises_query = new WP_Query(array(
        'post_type' => array('exercise'),
        'posts_per_page' => -1,
    ));


    $minimal_exercises_data = array();

while($minimal_exercises_query->have_posts()) {
    $minimal_exercises_query->the_post();

    $exercise_level = get_post_meta(get_the_ID(), 'exercise_level_options', true); // get the exercise level
    $category = wp_get_post_terms(get_the_ID(), 'exercise-category', array('fields' => 'names')); // get the exercise categories
    $nonce = wp_create_nonce('wp_rest');

    // Get post's permalink
    $permalink = get_the_permalink();

    if ( defined( 'ICL_SITEPRESS_VERSION' ) ) {
        $permalink = apply_filters( 'wpml_permalink', $permalink , $lang);
    }

    $is_done = false; // Assume not done
    $done_id = null; // Assume no done_post


    if ($current_user_id > 0) {
      // Check if this exercise is done by the current user
      $done_exercise_query = new WP_Query(array(
        'post_type' => array('done_post'),
        'posts_per_page' => 1,
        'author' => $current_user_id, // filter by author
        'meta_query' => array(
            array(
                'key' => 'done_post_id',
                'value' => get_the_ID(),
                'compare' => '=',
            ),
        ),
    ));
      if ($done_exercise_query->have_posts()) {
        $is_done = true;
        $done_id = $done_exercise_query->posts[0]->ID;
    }
}


    
        $is_saved = false; // Assume not saved
        $saved_id = null; // Assume no saved_post


        if ($current_user_id > 0) {
            // Check if this exercise is done by the current user
            $saved_exercise_query = new WP_Query(array(
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
            if ($saved_exercise_query->have_posts()) {
              $is_saved = true;
              $saved_id = $saved_exercise_query->posts[0]->ID;
          }
      }

    array_push($minimal_exercises_data, array(
        'postId' => get_the_ID(),
        'title' => get_the_title(),
        'permalink'=> $permalink,
        'level'=> $exercise_level,
        'category' => $category,
        'isDone' => $is_done,
        'doneId' => $done_id,
        'isSaved' => $is_saved,
        'savedId' => $saved_id


    ));


}
wp_reset_postdata();

return $minimal_exercises_data;
}

// HERE ALL POST_DONE ROUTES
// GET ALL done POSTS BY THE USER  custom post : done_exercise

add_action('rest_api_init', 'register_user_done_posts_api_endpoint');


function register_user_done_posts_api_endpoint() {
    register_rest_route('perfect-grammar/v1', 'posts/done', array(
        'methods' => WP_REST_SERVER::READABLE,
        'callback' => 'get_user_done_posts_data',
        'permission_callback' => '__return_true', 
    ));

}

function get_user_done_posts_data() {

    $done_posts_data = array();

    $done_post_query = new WP_Query(array(
        'post_type' => array('done_post'),
        'posts_per_page' => -1,
    ));

while($done_post_query->have_posts()) {
    $done_post_query->the_post();

    $done_post_id = get_post_meta(get_the_ID(), 'done_post_id', true);

    array_push($done_posts_data, array(
        'id' => get_the_ID(),
        'title' => get_the_title(),
        'done_post_id' => $done_post_id
    ));


}
wp_reset_postdata();


return $done_posts_data;

}


// CREATE AND DELETE DONE_POST ROUTES

add_action('rest_api_init', 'register_rest_route_post_done');

function register_rest_route_post_done() {
    register_rest_route('wp/v2', '/done_post/', array(
        'methods' => 'POST',
        'callback' => 'process_done_post',
        'permission_callback' => function() {
            return current_user_can('edit_done_exercises');
        }
    ));

    register_rest_route('wp/v2', '/done_post/(?P<id>\d+)', array(
        'methods' => 'DELETE',
        'callback' => 'delete_done_post',
        'permission_callback' => function() {
            return current_user_can('delete_done_exercises');
        },
        'args' => array(
            'id' => array(
                'validate_callback' => function($param, $request, $key) {
                    return is_numeric($param);
                }
            ),
        ),
    ));
}

function process_done_post(WP_REST_Request $request) {
    $params = json_decode($request->get_body());

    if(empty($params->title) || empty($params->meta->done_post_id)) {
        return new WP_Error('missing_params', 'Missing parameters', array('status' => 400));
    }

    $current_user_id = get_current_user_id();

    // Check if a post with the same done_post_id from the same author already exists
    $existing_post_query = new WP_Query(array(
        'author' => $current_user_id,
        'meta_query' => array(
            array(
                'key' => 'done_post_id',
                'value' => $params->meta->done_post_id,
                'compare' => '='
            )
        ),
        'post_type' => 'done_post',
        'posts_per_page' => 1
    ));

    if ($existing_post_query->have_posts()) {
        return new WP_Error('post_already_exists', 'A post with the same done_post_id already exists', array('status' => 400));
    }

    $new_post_args = array(
        'post_title'    => wp_strip_all_tags($params->title),
        'post_status'   => 'publish',
        'post_type'     => 'done_post',
        'meta_input'    => array(
            'done_post_id' => $params->meta->done_post_id
        ),
    );

    $post_id = wp_insert_post($new_post_args);

    if (is_wp_error($post_id)) {
        return new WP_Error('post_not_created', 'Error creating post', array('status' => 400));
    } else {
        return new WP_REST_Response(array('id' => $post_id), 200);
    }
}

function delete_done_post(WP_REST_Request $request) {
    $post_id = $request['id'];
    $post = get_post($post_id);

    if (empty($post) || $post->post_type != 'done_post') {
        return new WP_Error('post_not_found', 'Post not found', array('status' => 404));
    }

    if ($post->post_author != get_current_user_id() && !current_user_can('delete_others_done_exercises')) {
        return new WP_Error('permission_denied', 'Permission denied', array('status' => 403));
    }

    wp_delete_post($post_id, true);
    return new WP_REST_Response(null, 204);
}






// CREATE AND DELETE SAVED_POST ROUTES

add_action('rest_api_init', 'register_rest_route_post_saved');

function register_rest_route_post_saved() {
    register_rest_route('wp/v2', '/saved_post/', array(
        'methods' => 'POST',
        'callback' => 'process_saved_post',
        'permission_callback' => function() {
            return current_user_can('edit_saved_exercises');
        }
    ));

    register_rest_route('wp/v2', '/saved_post/(?P<id>\d+)', array(
        'methods' => 'DELETE',
        'callback' => 'delete_saved_post',
        'permission_callback' => function() {
            return current_user_can('delete_saved_exercises');
        },
        'args' => array(
            'id' => array(
                'validate_callback' => function($param, $request, $key) {
                    return is_numeric($param);
                }
            ),
        ),
    ));
}

function process_saved_post(WP_REST_Request $request) {
    $params = json_decode($request->get_body());

    if(empty($params->title) || empty($params->meta->saved_post_id)) {
        return new WP_Error('missing_params', 'Missing parameters', array('status' => 400));
    }

    $current_user_id = get_current_user_id();

    // Check if a post with the same saved_post_id from the same author already exists
    $existing_post_query = new WP_Query(array(
        'author' => $current_user_id,
        'meta_query' => array(
            array(
                'key' => 'saved_post_id',
                'value' => $params->meta->saved_post_id,
                'compare' => '='
            )
        ),
        'post_type' => 'saved_post',
        'posts_per_page' => 1
    ));

    if ($existing_post_query->have_posts()) {
        return new WP_Error('post_already_exists', 'A post with the same saved_post_id already exists', array('status' => 400));
    }

    $new_post_args = array(
        'post_title'    => wp_strip_all_tags($params->title),
        'post_status'   => 'publish',
        'post_type'     => 'saved_post',
        'meta_input'    => array(
            'saved_post_id' => $params->meta->saved_post_id
        ),
    );

    $post_id = wp_insert_post($new_post_args);

    if (is_wp_error($post_id)) {
        return new WP_Error('post_not_created', 'Error creating post', array('status' => 400));
    } else {
        return new WP_REST_Response(array('id' => $post_id), 200);
    }
}

function delete_saved_post(WP_REST_Request $request) {
    $post_id = $request['id'];
    $post = get_post($post_id);

    if (empty($post) || $post->post_type != 'saved_post') {
        return new WP_Error('post_not_found', 'Post not found', array('status' => 404));
    }

    if ($post->post_author != get_current_user_id() && !current_user_can('delete_others_saved_exercises')) {
        return new WP_Error('permission_denied', 'Permission denied', array('status' => 403));
    }

    wp_delete_post($post_id, true);
    return new WP_REST_Response(null, 204);
}





// get random exercise



function get_random_exercise(WP_REST_Request $request) {
    $lang = $request->get_param('lang');

    $random_exercise_query = new WP_Query(array(
        'post_type' => 'exercise',
        'orderby'   => 'rand',
        'posts_per_page' => 1,
    ));

    if($random_exercise_query->have_posts()){
        while ($random_exercise_query->have_posts()) {
            $random_exercise_query->the_post();

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
    register_rest_route( 'perfect-grammar/v1', '/exercise/random/', array(
        'methods' => 'GET',
        'callback' => 'get_random_exercise',
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
