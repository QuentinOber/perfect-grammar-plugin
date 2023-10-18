<?php get_header();
$post_id = get_the_ID();
$archive_link = get_post_type_archive_link('exercise');
$titleRaw = get_the_title();

?>
<meta name="titleRaw" content="<?php echo $titleRaw; ?>">

<main id="main" class="single-exercise-container" role="main">
<div class="top-navbar">
<a href="<?php echo esc_url($archive_link);?>"><button class="go-back nav-button"><< 🏃‍♂️🏃🏃‍♂️</button></a>
<a href="#"><button id="random-exercise-button" class="random-button nav-button">Random 🔀</button></a>

</div>
    <div class="exercise-content">

        <div id="exercise-container" class="exercise-container single-container" data-exercise-id="<?php echo $post_id; ?>">
        <!-- FIRST PART EXERCISE CONTENT w/o the exercise -->         
        </div>    
        <?php if(!is_user_logged_in()){ ?>
            <div class="login-header">
            <p class="login-text"><?php _e('Pour pouvoir suivre ton évolution et accéder à des centaines d\'exercices, crée-toi un compte gratuitement.', 'perfectgrammar'); ?></p>
            <a href="<?php echo wp_login_url(); ?>">
                <button><?php _e('Se connecter', 'perfectgrammar'); ?></button></a>
            </div>
            <?php }
            ?>   

    <div class="exercise-test">
            <p class="title-medium">Les exercices 🏋️‍♀️</p>
            
                    
            <?php
                    $test_content = get_post_meta($post_id, 'exercise_test', true);
                    echo do_shortcode($test_content);
            ?>  
            </div>
               
    
    
    <div id="exercise-container-second" class="exercise-container">
        <!-- FIRST PART EXERCISE CONTENT w/o the exercise -->         
    </div> 
    </div>   
    <?php  
    if (comments_open() || get_comments_number()) {
        comments_template();
    }?>
</main>


<?php get_footer(); ?>