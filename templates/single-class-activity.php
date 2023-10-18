<?php get_header();
$post_id = get_the_ID();
$archive_link = get_post_type_archive_link('class-activity');
$activity = get_post($post_id);
$content = apply_filters('the_content', $activity->post_content);
$titleRaw = get_the_title();



?>

<meta name="titleRaw" content="<?php echo $titleRaw; ?>">


<style>/* temporary, to clean) */.entry-content {
  display: none !important;
}</style>

<main id="main" class="single-activity-container" role="main">
    <div class="top-navbar">
        <a href="<?php  echo esc_url($archive_link);?>"><button class="go-back nav-button"><< 🏃‍♂️🏃🏃‍♂️</button></a>
        <a href="#"><button id="random-activity-button" class="random-button nav-button">Random 🔀</button></a>

    </div>
 

    <div class="activity-content">


        <div id="activity-container" class="activity-container single-container" data-activity-id="<?php echo $post_id; ?>">
        <!-- FIRST PART PART ACTIVITY CONTENT -->         
        </div>    
        
        <div class="key-info"><?php echo $content; ?></div> 
                     <!-- add the content here in raw php for H5P and shortcod purposes --> 

            <?php if(!is_user_logged_in()){ ?>
            <div class="login-header">
            <p class="login-text"><?php _e('Pour pouvoir suivre ton évolution et accéder à des centaines d\'exercices, crée-toi un compte gratuitement.', 'perfectgrammar'); ?></p>
            <a href="<?php echo wp_login_url(); ?>">
                <button><?php _e('Se connecter', 'perfectgrammar'); ?></button></a>
            </div>
            <?php }
            ?>            
        <div id="activity-container-second">
             <!-- SECOND PART ACTIVITY CONTENT  --> 
        </div>

    </div>   
    <?php  
    if (comments_open() || get_comments_number()) {
        comments_template();
    }?>
</main>
               
<div class="entry-content">



<?php get_footer(); ?>