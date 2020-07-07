<template>
  <div class="blogs">
    <!-- Title -->
    <div class="header">
      <p>DEV BLOGS</p>
      <!-- Shadow -->
      <span>DEV BLOGS</span>
    </div>

    <ul class="lists">
      <li class="blog" v-for="(blog, index) in blogs" :key="index">

        <!-- Main Blog -->
        <div class="main" v-if="index === 0" @click="openUrl(blog.url)">

          <!-- Image -->
          <div class="image">
            <img :src="require(`@/assets/img/blogs/${blog.image}.jpg`)" alt="">
          </div>

          <div class="title">
             <!-- Title -->
            <h2>{{blog.title.toUpperCase()}}</h2>

            <!-- Date -->
            <span>{{blog.date}}</span>
          </div>

          <!-- Description -->
          <p class="description">{{blog.description}}</p>
        </div>

        <!-- Recent Blogs -->
        <div class="secondary" v-if="index > 0" @click="openUrl(blog.url)">

          <!-- Image -->
          <div class="image">
            <img :src="require(`@/assets/img/blogs/${blog.image}.jpg`)" alt="">
          </div>

          <div class="info">
            <!-- Title -->
            <h2>{{blog.title.toUpperCase()}}</h2>

            <!-- Date -->
            <span>{{blog.date}}</span>

            <!-- Description -->
            <p>{{blog.description}}</p>
          </div>
        </div>
      </li>
    </ul>

    <div class="read-more">
      <lost-link class="primary" @click="openUrl('https://localhostgaming.com')">Read More</lost-link>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Blogs',
  data: () => ({
    blogs: [
      {
        title: 'Lorem Ipsum',
        date: 'April 20, 1998',
        description: 'What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing and typesetting industry',
        image: '1',
        url: 'https://localhostgaming.com',
      },
      {
        title: 'Lorem Ipsum',
        date: 'April 20, 1998',
        description: 'What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing  has been the industry\'s',
        image: '2',
        url: 'https://localhostgaming.com',
      },
      {
        title: 'Lorem Ipsum',
        date: 'April 20, 1998',
        description: 'What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing  has been the industry\'s',
        image: '3',
        url: 'https://localhostgaming.com',
      },
      {
        title: 'Lorem Ipsum',
        date: 'April 20, 1998',
        description: 'What is Lorem Ipsum Lorem Ipsum is simply dummy text of the printing  has been the industry\'s',
        image: '4',
        url: 'https://localhostgaming.com',
      },
    ],
  }),
  methods: {
    openUrl(url) {
      window.openExternalBrowser(url);
    },
  },
};
</script>

<style lang="scss">
  .blogs {
    height: 100%;
    width: 100%;
    padding: 0 18px;
    padding-top: 24px;
    /* background: color(dark-lighter); */

    .read-more {
      -webkit-app-region: no-drag;
      width: 100%;
      padding: 0 8px;

      p {
        display: block;
        margin-left: auto;
      }
      span {
        color: lighten(color(disabled), 5%);
        font-size: 14px;
        /* letter-spacing: 1px; */
      }
    }

    .header {
      width: 100%;
      height: 45px;
      position: relative;
      font-weight: 700;
      color: color(text);
      display: flex;
      flex-flow: column;
      align-items: center;
      justify-content: center;

      p {
        font-weight: 600;
        position: absolute;
        font-size: 22px;
        bottom: 0;
        z-index: 1;
      }

      span {
        color: darken(color(dark-lighter), 7%);
        position: absolute;
        font-size: 38px;
      }
    }

    .lists {
      margin-top: 8px;
      -webkit-app-region: no-drag;

      .blog {
        position: relative;

        .main {
          padding: 6px;
          border-radius: 2px;
          cursor: pointer;
          transition: background 0.2s;

          &:hover {
            background: color(dark-lighter);
          }

          &:active {
            background: darken(color(dark-lighter), 5%);
          }

          .image {
            height: 100px;
            overflow: hidden;
            border-radius: 2px;

            img {
              width: 100%;
              -webkit-user-drag: none;
            }
          }

          .title {
            margin-top: 2px;
            display: flex;

            h2 {
              font-size: 16px;
              color: color(primary);
            }

            span {
              margin: auto 0;
              margin-left: auto;
              color: color(disabled);
              font-size: 12px;
            }
          }

          .description {
            color: color(text);
            font-size: 14px;
            font-weight: 200;
            line-height: 1.3;
            letter-spacing: 0.8px;
          }
        }

        .secondary {
          margin-bottom: 4px;
          display: flex;
          padding: 6px;
          border-radius: 2px;
          cursor: pointer;

          transition: background 0.2s;

          &:hover {
            background: color(dark-lighter);
          }

          &:active {
            background: darken(color(dark-lighter), 5%);
          }

          .image {
            width: 80px;
            height: 80px;
            overflow: hidden;
            background-size: cover;
            border-radius: 2px;
            display: flex;
            flex-flow: column;
            align-items: center;
            justify-content: center;

            img {
              height: 100%;
              -webkit-user-drag: none;
            }
          }

          .info {
            display: block;
            width: calc(100% - 92px);
            margin-left: 12px;

            h2 {
              font-size: 14px;
              color: color(primary);
              line-height: 1;
              display: block;
            }

            span {
              display: block;
              font-size: 11px;
              color: color(disabled);
            }

            p {
              font-weight: 200;
              margin-top: 4px;
              color: color(text);
              font-size: 13px;
              line-height: 1.3;
              letter-spacing: 0.8px;
            }
          }
        }

      }
    }
  }
</style>
