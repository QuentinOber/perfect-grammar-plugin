<?php 
get_header(); 
?>


<title>Activités de classe</title>
<main id="main" class="archive-main" role="main">
<div class="archive-content">

<?php if(!is_user_logged_in()){ ?>
<div class="login-header">
<p class="login-text"><?php _e('Pour pouvoir suivre ton évolution et accéder à des centaines d\'exercices, crée-toi un compte gratuitement.', 'perfectgrammar'); ?></p>
  <a href="<?php echo wp_login_url(); ?>">
    <button><?php _e('Se connecter', 'perfectgrammar'); ?></button></a>
</div>
<?php }
?>

<div class="archive-grid-filter-child">
                         
            <div class="archive-filter" id="archive-filter">

    
                        

            <div class="level-wraper">


            
                    <?php
                    $activityLevelOptions = array('A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2');

                    if (!empty($activityLevelOptions) && is_array($activityLevelOptions)) {
                    ?>
                        <div class="filter-options-title">Niveau :</div>
                        <div class="level-options-container" id="level-options">
                            <?php
                            foreach ($activityLevelOptions as $option) {
                                $checked = isset($_GET['activity_level']) && $_GET['activity_level'] === $option ? 'checked' : '';
                            ?>
                                <div class="level-option">
                                    <div class="check">
                                        <label for="<?php echo $option; ?>">
                                            <input type="radio" id="<?php echo $option; ?>" name="activity_level" value="<?php echo $option; ?>" <?php echo $checked; ?>>
                                            <span><?php echo $option; ?></span>
                                        </label>
                                    </div>
                                </div>
                            <?php
                            }
                            ?>
                        </div>
                    <?php
                    }
                    ?>
            </div>
        
            <div class="search-saved">
            <div class="search-archive">
            <div class="inputBox_container">
                    <svg class="search_icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" alt="search icon">
                        <path d="M46.599 46.599a4.498 4.498 0 0 1-6.363 0l-7.941-7.941C29.028 40.749 25.167 42 21 42 9.402 42 0 32.598 0 21S9.402 0 21 0s21 9.402 21 21c0 4.167-1.251 8.028-3.342 11.295l7.941 7.941a4.498 4.498 0 0 1 0 6.363zM21 6C12.717 6 6 12.714 6 21s6.717 15 15 15c8.286 0 15-6.714 15-15S29.286 6 21 6z">
                        </path>
                    </svg>
                    <input class="inputBox" id="searchInput" type="text" placeholder="Rechercher...">
                    <input type="reset" id="clearSearch" value="X" class="hide">
                    </div>

            </div>

            <div class="save-checkbox-wrapper activity-item__save onlysaved"> 
            <label class="label-pf">       
                <input  class="label-pf__checkbox" type="checkbox" id="only-saved"/>
                <span class="label-pf__text">
                <span class="label-pf__check"><svg class="save-icon" id="save-icon" data-name="Group 23" xmlns="http://www.w3.org/2000/svg" width="15.33" height="20.094" viewBox="0 0 15.33 20.094">
                <path id="Path_52" data-name="Path 52" d="M517.434,385.807a1.63,1.63,0,0,1-.953-.311,1.77,1.77,0,0,1-.725-1.441c0-2.294-.04-10.739-.064-14.623a3.809,3.809,0,0,1,1.086-2.7,3.4,3.4,0,0,1,2.426-1.023h8.3a3.611,3.611,0,0,1,3.512,3.692c0,3.871,0,13.037-.023,14.533a1.771,1.771,0,0,1-.726,1.405,1.626,1.626,0,0,1-1.45.232.666.666,0,0,1-.219-.119c-2.072-1.694-4.38-3.529-5.179-4.095-.8.579-3.148,2.483-5.249,4.239a.669.669,0,0,1-.213.12A1.646,1.646,0,0,1,517.434,385.807Zm1.769-18.764a2.084,2.084,0,0,0-1.482.631,2.474,2.474,0,0,0-.7,1.751c.023,3.885.066,12.335.064,14.632a.426.426,0,0,0,.171.358.3.3,0,0,0,.186.061c5.458-4.561,5.7-4.556,5.985-4.555.273,0,.509.006,5.887,4.4h0a.3.3,0,0,0,.179-.061.427.427,0,0,0,.171-.348h0c.028-1.484.026-10.64.023-14.507a2.281,2.281,0,0,0-2.181-2.362Z" transform="translate(-515.691 -365.713)" stroke-width="2"/>        </svg>
                </span>
                </span>
            </label>
            </div>


            </div>
            </div>

            <div class="wrapper-content-archive">
        <div class="side-bar-activity-archive-container" id="side-bar-archive">
                <label class="container-checkbox category" id="conjugaison">
                    <input type="checkbox">
                    <div class="checkmark"></div>
                    <span>Conjugaison</span>
                </label>

                <label class="container-checkbox category" id="grammaire">
                    <input type="checkbox">
                    <div class="checkmark"></div>
                    <span>Grammaire</span>
                </label>

                <label class="container-checkbox category" id="conversation">
                    <input type="checkbox" >
                    <div class="checkmark"></div>
                    <span>Conversation</span>
                </label>

                <label class="container-checkbox category" id="vocabulaire">
                    <input type="checkbox" >
                    <div class="checkmark"></div>
                    <span>Vocabulaire</span>
                </label>

        </div>

       

        <div id="class-activity-archive-container" class="post-grid-class-activity">

        </div>   
        </div>     
</div>         
</main>
<?php get_footer(); ?>