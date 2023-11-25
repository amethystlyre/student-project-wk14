const router = require('express').Router();
const { Project, User } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
    try {
        const projectData = await Project.findAll({
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });

        const projects = projectData.map((project) =>
            project.get({ plain: true })
        );
        res.render('homepage', {
            projects,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/project/:id', async (req, res) => {
    try {
        const projectData = await Project.findByPk(req.params.id, {
            include: [
                {
                    model: User,
                    attributes: ['name'],
                },
            ],
        });

        const project = projectData.get({ plain: true });

        res.render('project', {
            project,
            logged_in: req.session.logged_in,
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

router.get('/login', (req, res) => {
    if (req.session.logged_in) {
        res.redirect('/');
        return;
    }

    res.render('login');
});

router.get('/profile', withAuth, async (req, res) => {
    try {
        const userData = await User.findByPk(req.session.user_id, {
            include: [
                {
                    model: Project,
                    attributes: ['id', 'name'],
                },
            ],
            attributes: { exclude: ['password'] },
        });

        const user = userData.get({ plain: true });
        const projects = user.projects;

        res.render('profile', {
            user,
            projects,
            logged_in: req.session.logged_in,
        });
        //console.log(user);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

module.exports = router;
